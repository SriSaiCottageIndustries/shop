
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_KzWPZAJm_4wnw1ZgJYobxcq86Gne1zxVF');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, address, email, items, total } = body;

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td class="item-name">${item.name}</td>
        <td style="text-align: center;" class="item-qty">x${item.quantity}</td>
        <td style="text-align: right;">${item.price}</td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: 'Sri Sai Cottage <onboarding@resend.dev>',
      // Test mode only allows sending to verified address (Admin). 
      // Customer email is excluded to prevent API errors until domain is verified.
      to: ['sscshevapet@gmail.com'],
      subject: `Order Confirmation - Sri Sai Cottage Industries`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #2C1810; margin: 0; padding: 0; background-color: #FFF8DC; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: #2C1810; padding: 40px 20px; text-align: center; color: #FFF8DC; }
            .header h1 { margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; letter-spacing: 1px; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; color: #5D4037; margin-bottom: 20px; }
            .order-info { background: #FFF8F0; border: 1px solid #EFEBE9; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
            .order-info p { margin: 5px 0; font-size: 14px; color: #6D4C41; }
            .order-info strong { color: #2C1810; }
            .table-container { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table-container th { text-align: left; padding: 12px; border-bottom: 2px solid #EFEBE9; color: #8B4513; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .table-container td { padding: 16px 12px; border-bottom: 1px solid #F5F5F5; font-size: 14px; }
            .item-name { font-weight: 600; color: #2C1810; }
            .item-qty { color: #8B4513; }
            .total-section { text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #EFEBE9; }
            .total-amount { font-size: 24px; font-weight: bold; color: #FF9933; }
            .footer { background: #FDFBF7; padding: 30px; text-align: center; font-size: 12px; color: #8D6E63; border-top: 1px solid #EFEBE9; }
            .btn { display: inline-block; background: #FF9933; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sri Sai Cottage Industries</h1>
              <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Authentic Pooja Items & Divine Decor</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Namaste <strong>${name}</strong>,
                <p style="font-size: 16px; margin-top: 10px; color: #666;">We are delighted to confirm your order. Your sacred items are being prepared with care and devotion.</p>
              </div>

              <div class="order-info">
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Delivery Address:</strong><br>${address}</p>
              </div>

              <table class="table-container">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total-section">
                <p style="margin: 0; font-size: 14px; color: #666;">Total Amount</p>
                <div class="total-amount">₹${total.toLocaleString("en-IN")}</div>
              </div>

              <div style="text-align: center;">
                <a href="https://srisaicottage.com" class="btn">Visit Our Store</a>
              </div>
            </div>

            <div class="footer">
              <p>Questions? Contact us at support@srisaicottage.com</p>
              <p>&copy; ${new Date().getFullYear()} Sri Sai Cottage Industries. All rights reserved.</p>
              <p>Shevapet, Salem - 636002</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
