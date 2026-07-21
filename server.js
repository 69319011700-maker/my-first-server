const http = require('http');
// 1. เรียกใชงาน Pool จากไลบรารี pg สําหรับจัดการการเชื่อมตอฐานขอมูล
const { Pool } = require('pg');
// 2. ตั้งคาการเชื่อมตอ โดยดึง URL มาจาก Environment Variable ของ Railway
const pool = new Pool({
connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html; charset=utf-8');

try {
// 3. ขอเชื่อมตอและสงคําสั่ง SQL ไปดึงขอมูลจากตาราง students
const client = await pool.connect();
const result = await client.query('SELECT * FROM students');
client.release(); // คนืการเชื่อมตอเมื่อใชงานเสร็จ
// 4. นําขอมูลที่ได(result.rows) มาประกอบเปนตาราง HTML

const html = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ฐานขอมูลนักศึกษา</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 900px;
            width: 100%;
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
            font-size: 2.5em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        
        .stat-box .number {
            font-size: 2em;
            font-weight: bold;
            display: block;
        }
        
        .stat-box .label {
            font-size: 0.9em;
            margin-top: 5px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 1.05em;
        }
        
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
            color: #333;
        }
        
        tbody tr {
            transition: all 0.3s ease;
        }
        
        tbody tr:hover {
            background-color: #f5f5f5;
            box-shadow: inset 0 0 10px rgba(102, 126, 234, 0.1);
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #999;
            font-size: 1.2em;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #999;
            font-size: 0.9em;
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }
            
            h1 {
                font-size: 1.8em;
            }
            
            .stats {
                flex-direction: column;
                gap: 10px;
            }
            
            table {
                font-size: 0.9em;
            }
            
            th, td {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 ฐานขอมูลนักศึกษา</h1>
        <p class="subtitle">ระบบจัดการข้อมูลนักศึกษา</p>
        
        <div class="stats">
            <div class="stat-box">
                <span class="number">${result.rows.length}</span>
                <span class="label">จำนวนนักศึกษา</span>
            </div>
        </div>
        
        ${result.rows.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>🆔 รหัสนักศึกษา</th>
                        <th>👤 ชื่อ-นามสกุล</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.rows.map(row => `
                        <tr>
                            <td>${row.student_id}</td>
                            <td>${row.student_name}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : `
            <div class="no-data">
                📭 ไม่มีข้อมูลนักศึกษา
            </div>
        `}
        
        <div class="footer">
            ✅ เชื่อมต่อฐานข้อมูลสำเร็จ
        </div>
    </div>
</body>
</html>
`;
res.end(html);
} catch (err) {
// กรณเีชื่อมตอไมไดหรือเขียนชื่อตารางผิด
console.error(err);
const errorHtml = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เกิดข้อผิดพลาด</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        
        h1 {
            color: #f5576c;
            margin-bottom: 20px;
            font-size: 2em;
        }
        
        .error-box {
            background: #ffebee;
            border-left: 5px solid #f5576c;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: left;
        }
        
        .error-message {
            color: #333;
            font-family: 'Courier New', monospace;
            font-size: 0.95em;
            word-break: break-all;
        }
        
        p {
            color: #666;
            margin: 20px 0;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚠️ เกิดข้อผิดพลาด!</h1>
        <p>ไม่สามารถเชื่อมต่อฐานข้อมูลได้</p>
        <div class="error-box">
            <div class="error-message">${err.message}</div>
        </div>
        <p>กรุณาตรวจสอบ:</p>
        <ul style="text-align: left; color: #666;">
            <li>DATABASE_URL มีค่าถูกต้องหรือไม่</li>
            <li>ชื่อตาราง students มีอยู่ในฐานข้อมูลหรือไม่</li>
            <li>การเชื่อมต่ออินเทอร์เน็ตของเซิร์ฟเวอร์</li>
        </ul>
    </div>
</body>
</html>
`;
res.end(errorHtml);
}
});
server.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});
