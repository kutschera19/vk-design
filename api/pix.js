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
          name: "Cliente VK Design",
          email: "cliente@email.com",
          tax_id: "12345678909"
        },
        items: [
          {
            name: "Serviço VK Design",
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

    res.status(200).json({
      qr_code: data.qr_codes[0].text,
      qr_image: data.qr_codes[0].links[0].href
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar Pix" });
  }
}
