// 1. เรียกใช้งาน Module ที่ชื่อว่า 'http' ซึ่งเป็นระบบพื้นฐานของ Node.js สำหรับทำเซิร์ฟเวอร์
const http = require('http');

// 2. กำหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร โดยให้ใช้ของที่ Cloud กำหนดมา(process.env.PORT) ถ้าไม่มีให้ใช้ 3000
const port = process.env.PORT || 3000;

// 3. สร้างเครื่องแม่ข่าย (Server) ที่คอยรับคำขอ (req) และตอบกลับ (res)
const server = http.createServer((req, res) => {

    // 3.1 ตั้งรหัสสถานะ 200 หมายถึง "ทำงานสำเร็จ (OK)"
    res.statusCode = 200;

    // 3.2 บอกเบราว์เซอร์ของผู้ใช้ว่า สิ่งที่ส่งกลับไปคือไฟล์ข้อความแบบ HTML และรองรับภาษาไทย (utf-8)
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // 3.3 ส่งข้อมูลหน้าเว็บพร้อม UI ที่ตกแต่งแล้วกลับไปหาผู้ใช้
    const htmlOutput = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Railway Web Server</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap" rel="stylesheet">
        
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Kanit', sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #f8fafc;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 3rem 2rem;
                border-radius: 24px;
                box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
                text-align: center;
                max-width: 550px;
                width: 100%;
                transition: transform 0.3s ease;
            }
            .container:hover {
                transform: translateY(-5px);
            }
            h1 {
                font-size: 1.8rem;
                color: #38bdf8;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            .student-info {
                font-size: 1.2rem;
                color: #e2e8f0;
                background: rgba(255, 255, 255, 0.05);
                padding: 0.75rem;
                border-radius: 12px;
                margin: 1.5rem 0;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .status-badge {
                background: rgba(34, 197, 94, 0.15);
                border: 1px solid rgba(34, 197, 94, 0.3);
                padding: 0.75rem 1.25rem;
                border-radius: 50px;
                display: inline-flex;
                align-items: center;
                gap: 12px;
                color: #4ade80;
                font-size: 0.95rem;
                font-weight: 400;
            }
            .pulse-dot {
                width: 12px;
                height: 12px;
                background-color: #22c55e;
                border-radius: 50%;
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                animation: pulse 1.6s infinite;
            }
            @keyframes pulse {
                0% {
                    transform: scale(0.9);
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                }
                70% {
                    transform: scale(1);
                    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
                }
                100% {
                    transform: scale(0.9);
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>สวัสดีครับ! นี่คือ Web Server ของผม</h1>
            <div class="student-info">
                <strong>นาย นรากร สวนนาค</strong> <br>
                <span style="color: #94a3b8; font-size: 1rem;">รหัสนักศึกษา: 69319011700</span>
            </div>
            <div class="status-badge">
                <div class="pulse-dot"></div>
                <span>เครื่องแม่ข่ายทำงานปกติบนระบบ Railway แล้วครับผม!</span>
            </div>
        </div>
    </body>
    </html>
    `;

    res.end(htmlOutput);
});

// 4. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กำหนดไว้
server.listen(port, () => {
    console.log(`Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: ${port}`);
});
