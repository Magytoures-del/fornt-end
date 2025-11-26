import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email templates
const clientEmailTemplate = (formData, currentLanguage = "ar") => {
  const isArabic = currentLanguage === "ar";

  if (isArabic) {
    return {
      subject: "شكراً لتواصلك معنا - Flymoon Agency",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>شكراً لتواصلك معنا</title>
            <style>
                @media only screen and (max-width: 600px) {
                    .container { width: 100% !important; padding: 10px !important; }
                    .header { padding: 20px !important; }
                    .content { padding: 20px !important; }
                    .header h1 { font-size: 24px !important; }
                    .message-details { padding: 15px !important; }
                    .contact-info { padding: 0 !important; }
                }
                @media only screen and (max-width: 480px) {
                    .header h1 { font-size: 20px !important; }
                    .greeting { font-size: 16px !important; }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh;">
            <div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                
                <!-- Header Section -->
                <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ffd89b 0%, #19547b 100%);"></div>
                    <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                        <img src="${
                          process.env.NEXT_PUBLIC_BASE_URL ||
                          "https://www.flymoon.sa"
                        }/light-logo.png" alt="Flymoon Agency Logo" style="height: 80px; width: auto; display: block;">
                    </div>
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">شكراً لتواصلك معنا</h1>
                    <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9; font-weight: 300;">فلاي مون</p>
                    <div style="margin-top: 20px; width: 60px; height: 2px; background: rgba(255,255,255,0.3); margin-left: auto; margin-right: auto;"></div>
                </div>
                
                <!-- Content Section -->
                <div class="content" style="padding: 40px 30px; background: #ffffff;">
                    <p class="greeting" style="font-size: 20px; margin-bottom: 25px; color: #2c3e50; font-weight: 600;">عزيزي/عزيزتي ${
                      formData.name
                    },</p>
                    
                    <p style="margin-bottom: 25px; color: #34495e; font-size: 16px; line-height: 1.8;">شكراً لك على تواصلك معنا. لقد استلمنا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن خلال <strong style="color: #667eea;">24 ساعة</strong>.</p>
                    
                    <!-- Message Details Card -->
                    <div class="message-details" style="background: linear-gradient(135deg, #f8f9ff 0%, #e3e8ff 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-right: 4px solid #667eea; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);">
                        <h3 style="color: #667eea; margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-left: 10px; font-size: 20px;">📋</span>
                            تفاصيل رسالتك:
                        </h3>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                            <p style="margin: 0; color: #2c3e50;"><strong style="color: #667eea;">الموضوع:</strong> ${
                              formData.subject
                            }</p>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px;">
                            <p style="margin: 0 0 10px 0; color: #667eea; font-weight: 600;">الرسالة:</p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-right: 3px solid #e9ecef; font-size: 15px; line-height: 1.6; color: #495057;">${
                              formData.message
                            }</div>
                        </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 50%, #fff5f5 100%); padding: 25px; border-radius: 12px; margin: 30px 0;">
                        <h4 style="color: #e53e3e; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-left: 10px; font-size: 18px;">📞</span>
                            للاستفسارات العاجلة، تواصل معنا:
                        </h4>
                        <div class="contact-info" style="display: grid; gap: 12px;">
                            <div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                <span style="margin-left: 12px; font-size: 16px;">📱</span>
                                <span style="color: #2c3e50;"><strong>الهاتف:</strong> +966920014937</span>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                <span style="margin-left: 12px; font-size: 16px;">📧</span>
                                <span style="color: #2c3e50;"><strong>البريد الإلكتروني:</strong> booking@flymoonsa.com</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Social Media Section -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                        <h4 style="color: white; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center;">
                            <span style="margin-left: 10px; font-size: 18px;">🌐</span>
                            تابعنا على وسائل التواصل الاجتماعي
                        </h4>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                            <a href="https://www.instagram.com/flymoon_sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Instagram">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/089ec8c1c48920331c10b361311862e8ab6fd632-512x512.png" alt="Instagram" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.youtube.com/@Flymoon_sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="YouTube">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/dfe8b2b6c8c521e383d287c7029707063cba94cf-512x512.png" alt="YouTube" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://twitter.com/Flymoon_sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Twitter">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/aa3501ead5bc48abe2c260cd3d8d75704913d793-512x512.png" alt="Twitter" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://wa.me/1234567890" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="WhatsApp">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/34563c0a21c5cc0772163eb69b48190e337e32f1-512x512.png" alt="WhatsApp" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.facebook.com/flymoon.sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Facebook">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/30f6891d30288d8015efa9080cd1cbb444e6b1de-512x512.png" alt="Facebook" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.snapchat.com/add/flymoon.sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Snapchat">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/7c9cf1ec5c6b046f14f5fcb0dd895c9ce4017243-512x512.png" alt="Snapchat" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.tiktok.com/@flymoonagency" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="TikTok">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/48f2194c266f4b76954eb6bb2a6abe5af65a7127-512x512.png" alt="TikTok" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                        </div>
                        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 15px 0 0 0;">ابق على تواصل معنا لأحدث العروض والوجهات</p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #f1f3f4;">
                        <div style="margin-bottom: 20px;">
                            <img src="${
                              process.env.NEXT_PUBLIC_BASE_URL ||
                              "https://www.flymoon.sa"
                            }/logo.png" alt="Flymoon Agency Logo" style="height: 70px; width: auto; display: inline-block;">
                        </div>
                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 25px; margin-bottom: 20px;">
                            <p style="margin: 0; font-size: 16px; font-weight: 600;">مع أطيب التحيات</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">فريق فلاي مون ✈️</p>
                        </div>
                        <p style="color: #718096; font-size: 12px; margin: 0;">هذه رسالة تلقائية، يرجى عدم الرد عليها مباشرة</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };
  } else {
    return {
      subject: "Thank you for contacting us - Flymoon Agency",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for contacting us</title>
            <style>
                @media only screen and (max-width: 600px) {
                    .container { width: 100% !important; padding: 10px !important; }
                    .header { padding: 20px !important; }
                    .content { padding: 20px !important; }
                    .header h1 { font-size: 24px !important; }
                    .message-details { padding: 15px !important; }
                    .contact-info { padding: 0 !important; }
                }
                @media only screen and (max-width: 480px) {
                    .header h1 { font-size: 20px !important; }
                    .greeting { font-size: 16px !important; }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh;">
            <div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                
                <!-- Header Section -->
                <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ffd89b 0%, #19547b 100%);"></div>
                    <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                        <img src="${
                          process.env.NEXT_PUBLIC_BASE_URL ||
                          "https://www.flymoon.sa"
                        }/light-logo.png" alt="Flymoon Agency Logo" style="height: 80px; width: auto; display: block;">
                    </div>
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Thank You for Contacting Us</h1>
                    <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9; font-weight: 300;">Flymoon Agency</p>
                    <div style="margin-top: 20px; width: 60px; height: 2px; background: rgba(255,255,255,0.3); margin-left: auto; margin-right: auto;"></div>
                </div>
                
                <!-- Content Section -->
                <div class="content" style="padding: 40px 30px; background: #ffffff;">
                    <p class="greeting" style="font-size: 20px; margin-bottom: 25px; color: #2c3e50; font-weight: 600;">Dear ${
                      formData.name
                    },</p>
                    
                    <p style="margin-bottom: 25px; color: #34495e; font-size: 16px; line-height: 1.8;">Thank you for reaching out to us. We have received your message and will get back to you as soon as possible within <strong style="color: #667eea;">24 hours</strong>.</p>
                    
                    <!-- Message Details Card -->
                    <div class="message-details" style="background: linear-gradient(135deg, #f8f9ff 0%, #e3e8ff 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #667eea; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);">
                        <h3 style="color: #667eea; margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 20px;">📋</span>
                            Your Message Details:
                        </h3>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                            <p style="margin: 0; color: #2c3e50;"><strong style="color: #667eea;">Subject:</strong> ${
                              formData.subject
                            }</p>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px;">
                            <p style="margin: 0 0 10px 0; color: #667eea; font-weight: 600;">Message:</p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 3px solid #e9ecef; font-size: 15px; line-height: 1.6; color: #495057;">${
                              formData.message
                            }</div>
                        </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 50%, #fff5f5 100%); padding: 25px; border-radius: 12px; margin: 30px 0;">
                        <h4 style="color: #e53e3e; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 18px;">📞</span>
                            For urgent inquiries, reach us at:
                        </h4>
                        <div class="contact-info" style="display: grid; gap: 12px;">
                            <div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                <span style="margin-right: 12px; font-size: 16px;">📱</span>
                                <span style="color: #2c3e50;"><strong>Phone:</strong> +1234567890</span>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                <span style="margin-right: 12px; font-size: 16px;">📧</span>
                                <span style="color: #2c3e50;"><strong>Email:</strong> booking@flymoonsa.com</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Social Media Section -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                        <h4 style="color: white; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center;">
                            <span style="margin-right: 10px; font-size: 18px;">🌐</span>
                            Follow us on social media
                        </h4>
                        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                            <a href="https://www.instagram.com/flymoon_sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Instagram">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/089ec8c1c48920331c10b361311862e8ab6fd632-512x512.png" alt="Instagram" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.youtube.com/@Flymoon_sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="YouTube">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/dfe8b2b6c8c521e383d287c7029707063cba94cf-512x512.png" alt="YouTube" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://twitter.com/Flymoon_sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Twitter">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/aa3501ead5bc48abe2c260cd3d8d75704913d793-512x512.png" alt="Twitter" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://wa.me/1234567890" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="WhatsApp">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/34563c0a21c5cc0772163eb69b48190e337e32f1-512x512.png" alt="WhatsApp" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.facebook.com/flymoon.sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Facebook">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/30f6891d30288d8015efa9080cd1cbb444e6b1de-512x512.png" alt="Facebook" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.snapchat.com/add/flymoon.sa" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="Snapchat">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/7c9cf1ec5c6b046f14f5fcb0dd895c9ce4017243-512x512.png" alt="Snapchat" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                            <a href="https://www.tiktok.com/@flymoonagency" target="_blank" style="display: inline-block; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" title="TikTok">
                                <img src="https://cdn.sanity.io/images/kwqm869g/production/48f2194c266f4b76954eb6bb2a6abe5af65a7127-512x512.png" alt="TikTok" style="width: 20px; height: 20px; object-fit: contain;">
                            </a>
                        </div>
                        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 15px 0 0 0;">Stay connected for the latest offers and destinations</p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #f1f3f4;">
                        <div style="margin-bottom: 20px;">
                            <img src="${
                              process.env.NEXT_PUBLIC_BASE_URL ||
                              "https://www.flymoon.sa"
                            }/logo.png" alt="Flymoon Agency Logo" style="height: 70px; width: auto; display: inline-block;">
                        </div>
                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 25px; margin-bottom: 20px;">
                            <p style="margin: 0; font-size: 16px; font-weight: 600;">Best Regards</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Flymoon Agency Team ✈️</p>
                        </div>
                        <p style="color: #718096; font-size: 12px; margin: 0;">This is an automated message, please do not reply directly</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };
  }
};

const adminEmailTemplate = (formData) => {
  return {
    subject: `New Contact Form Submission - ${formData.subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                      <div style="background: #dc3545; padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="margin: 10px 0 0;">Flymoon Agency - Admin Panel</p>
            </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
                  <h2 style="color: #dc3545; margin-top: 0;">Customer Information</h2>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Full Name:</td>
                          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                            formData.name
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                          <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${
                            formData.email
                          }">${formData.email}</a></td>
                      </tr>
                      <tr>
                          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                            formData.phone || "Not provided"
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                            formData.subject
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                          <td style="padding: 10px;">
                              <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${
                                formData.message
                              }</div>
                          </td>
                      </tr>
                  </table>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px;">
                  <p style="margin: 0; color: #155724;"><strong>Action Required:</strong> Please respond to this customer inquiry within 24 hours.</p>
              </div>
              
                              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p style="color: #666; font-size: 14px;">Flymoon Agency<br>Admin Notification System</p>
                </div>
          </div>
      </body>
      </html>
    `,
  };
};

// Create transporter
const createTransporter = (smtpUser, smtpPass) => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true" || true, // true for port 465, false for port 587
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, language } = body;

    // Validate required fields
    if (
      !formData?.name ||
      !formData?.email ||
      !formData?.subject ||
      !formData?.message
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get SMTP credentials (with fallbacks)
    // TODO: Remove hardcoded credentials and use environment variables
    const smtpUser = process.env.SMTP_USER || "booking@flymoonsa.com";
    const smtpPass = process.env.SMTP_PASS || "~|FrM6s9Q";

    // Validate SMTP credentials
    if (!smtpUser || !smtpPass) {
      console.error("SMTP configuration missing");
      return NextResponse.json(
        { success: false, error: "Email service configuration error" },
        { status: 500 }
      );
    }

    const transporter = createTransporter(smtpUser, smtpPass);

    // Generate email templates
    const clientEmail = clientEmailTemplate(formData, language);
    const adminEmail = adminEmailTemplate(formData);

    // Send confirmation email to client
    await transporter.sendMail({
      from: `"Flymoon Agency" <${smtpUser}>`,
      to: formData.email,
      subject: clientEmail.subject,
      html: clientEmail.html,
    });

    // Send notification email to admin
    const adminEmailAddress = process.env.ADMIN_EMAIL || smtpUser;
    await transporter.sendMail({
      from: `"Flymoon Agency Contact Form" <${smtpUser}>`,
      to: adminEmailAddress,
      subject: adminEmail.subject,
      html: adminEmail.html,
    });

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email. Please try again later.",
      },
      { status: 500 }
    );
  }
}
