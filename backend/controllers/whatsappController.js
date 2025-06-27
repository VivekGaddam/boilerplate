const twilio = require('../config/twilio');

const sendWhatsAppMessage = async (req, res) => {
  const { to, body } = req.body;

  try {
    const message = await twilio.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: body,
    });

    console.log(`WhatsApp message sent to ${to}: ${message.sid}`);
    res.status(200).json({ success: true, message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, message: 'Failed to send WhatsApp message' });
  }
};

module.exports = { sendWhatsAppMessage };
