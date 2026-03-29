export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.pagseguro.com/orders", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 69e292e3-f837-4b37-883c-963b27315aca888d024d4c1588bd620ea91d95d348074f70-a440-46d2-932e-1dcf23daf27f",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reference_id: "pedido_" + Date.now(),
        customer: {
          name: "Vitor Teste",
          email: "teste@vkdesign.com",
          tax_id: "14332316622"
        },
        items: [
          {
            name: "Servico VK Design",
            quantity: 1,
            unit_amount: 5000
          }
        ],
        qr_codes: [
          {
            amount: {
              value: 5000
            }
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 MOSTRA ERRO REAL
    console.log("Resposta PagSeguro:", data);

    // 🔥 TRATAMENTO SE DER ERRO
    if (!data.qr_codes) {
      return res.status(400).json({
        erro: "Erro vindo do PagSeguro",
        detalhe: data
      });
    }

    // 🔥 SUCESSO
    return res.status(200).json({
      qr_code: data.qr_codes[0].text,
      qr_image: data.qr_codes[0].links[0].href
    });

  } catch (error) {
    console.error("Erro interno:", error);

    return res.status(500).json({
      erro: "Erro interno no servidor",
      detalhe: error.message
    });
  }
}
