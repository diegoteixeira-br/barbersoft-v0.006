import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const body = await req.json();
    const { barber_id, term_id } = body;

    if (!barber_id) {
      return new Response(JSON.stringify({ error: "barber_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get barber info
    const { data: barber, error: barberErr } = await supabase
      .from("barbers")
      .select("*, units(name)")
      .eq("id", barber_id)
      .single();

    if (barberErr || !barber) {
      return new Response(JSON.stringify({ error: "Profissional não encontrado" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!barber.email) {
      return new Response(JSON.stringify({ error: "Profissional não possui email cadastrado" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the active term for the company
    let term;
    if (term_id) {
      const { data, error } = await supabase
        .from("partnership_terms")
        .select("*")
        .eq("id", term_id)
        .single();
      if (error) throw error;
      term = data;
    } else {
      const { data, error } = await supabase
        .from("partnership_terms")
        .select("*")
        .eq("company_id", barber.company_id)
        .eq("is_active", true)
        .single();
      if (error || !data) {
        return new Response(JSON.stringify({ error: "Nenhum termo ativo encontrado para esta empresa" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      term = data;
    }

    // Replace variables in content
    const unitName = barber.units?.name || "Unidade";
    const content = term.content
      .replace(/\{\{nome\}\}/g, barber.name)
      .replace(/\{\{comissao\}\}/g, `${barber.commission_rate}%`)
      .replace(/\{\{unidade\}\}/g, unitName);

    // Format content for HTML
    const htmlContent = content.replace(/\n/g, '<br/>');

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "BarberSoft <noreply@barbersoft.com.br>",
        to: [barber.email],
        subject: `${term.title} - BarberSoft`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #FF6B00; text-align: center;">BarberSoft</h1>
            <h2 style="text-align: center;">${term.title}</h2>
            <p>Olá, <strong>${barber.name}</strong>!</p>
            <p>Segue abaixo o termo de parceria da sua barbearia. Este termo será apresentado para aceite no seu próximo login no sistema.</p>
            <div style="background-color: #f8f8f8; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
              <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Versão ${term.version}</p>
              <div style="font-size: 14px; line-height: 1.6;">
                ${htmlContent}
              </div>
            </div>
            <p style="font-size: 13px; color: #666;">
              <strong>Importante:</strong> Para aceitar este termo digitalmente, faça login no sistema BarberSoft. 
              Sua comissão acordada é de <strong>${barber.commission_rate}%</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 11px; text-align: center;">
              BarberSoft - Sistema de Gestão para Barbearias
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error("Resend error:", errBody);
      return new Response(JSON.stringify({ error: "Erro ao enviar email", details: errBody }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Email enviado com sucesso" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
