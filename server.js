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
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
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
            border-radius: 20px;
            box-shadow: 0 20px 80px rgba(0, 0, 0, 0.2);
            padding: 50px;
            max-width: 1000px;
            width: 100%;
            animation: slideIn 0.6s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 5px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
        }
        
        h1 {
            color: #333;
            font-size: 3em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 20px 0 10px 0;
            font-weight: 700;
            letter-spacing: -1px;
        }
        
        .subtitle {
            color: #888;
            font-size: 1.2em;
            margin-bottom: 5px;
            font-weight: 300;
        }
        
        .tagline {
            color: #aaa;
            font-size: 0.95em;
            margin-bottom: 30px;
        }
        
        .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-box::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transition: all 0.6s ease;
        }
        
        .stat-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }
        
        .stat-box:hover::before {
            top: -10%;
            right: -10%;
        }
        
        .stat-content {
            position: relative;
            z-index: 1;
        }
        
        .stat-box .number {
            font-size: 2.8em;
            font-weight: 700;
            display: block;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .stat-box .label {
            font-size: 0.95em;
            font-weight: 500;
            opacity: 0.95;
            letter-spacing: 0.5px;
        }
        
        .table-wrapper {
            overflow-x: auto;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            margin-top: 30px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            position: sticky;
            top: 0;
        }
        
        th {
            padding: 18px 20px;
            text-align: left;
            font-weight: 600;
            font-size: 1.1em;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 16px 20px;
            border-bottom: 1px solid #e8e8e8;
            color: #333;
            font-size: 1em;
        }
        
        tbody tr {
            transition: all 0.3s ease;
            background: white;
        }
        
        tbody tr:hover {
            background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            box-shadow: inset 0 0 15px rgba(102, 126, 234, 0.08);
        }
        
        tbody tr:nth-child(even) {
            background: #f9f9fb;
        }
        
        tbody tr:nth-child(even):hover {
            background: linear-gradient(90deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
        }
        
        .no-data {
            text-align: center;
            padding: 60px 40px;
            color: #ccc;
            font-size: 1.3em;
        }
        
        .no-data i {
            font-size: 3em;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #e8e8e8;
            color: #888;
            font-size: 0.95em;
        }
        
        .success-icon {
            color: #48bb78;
            margin-right: 8px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 30px;
            }
            
            h1 {
                font-size: 2.2em;
            }
            
            .subtitle {
                font-size: 1em;
            }
            
            .stats-container {
                grid-template-columns: 1fr;
            }
            
            table {
                font-size: 0.95em;
            }
            
            th, td {
                padding: 12px 15px;
            }
            
            .stat-box .number {
                font-size: 2.2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="subtitle">📚 ระบบข้อมูล</div>
            <h1>นักศึกษา</h1>
            <div class="tagline">จัดการและติดตามข้อมูลนักศึกษาด้วยระบบที่ทันสมัย</div>
        </div>
        
        <div class="stats-container">
            <div class="stat-box">
                <div class="stat-content">
                    <span class="number">${result.rows.length}</span>
                    <span class="label">จำนวนนักศึกษา</span>
                </div>
            </div>
        </div>
        
        ${result.rows.length > 0 ? `
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th><i class="fas fa-id-card"></i> รหัสนักศึกษา</th>
                            <th><i class="fas fa-user"></i> ชื่อ-นามสกุล</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.rows.map((row, index) => `
                            <tr>
                                <td>${row.student_id}</td>
                                <td>${row.student_name}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        ` : `
            <div class="no-data">
                <i class="fas fa-inbox"></i>
                <p>ไม่มีข้อมูลนักศึกษา</p>
            </div>
        `}
        
        <div class="footer">
            <i class="fas fa-check-circle success-icon"></i> เชื่อมต่อฐานข้อมูลสำเร็จ
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
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
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
            border-radius: 20px;
            box-shadow: 0 20px 80px rgba(0, 0, 0, 0.2);
            padding: 50px;
            max-width: 600px;
            width: 100%;
            text-align: center;
            animation: slideIn 0.6s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        h1 {
            color: #f5576c;
            margin-bottom: 15px;
            font-size: 2.5em;
            font-weight: 700;
        }
        
        .icon-wrapper {
            font-size: 4em;
            color: #f5576c;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .error-box {
            background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
            border-left: 5px solid #f5576c;
            padding: 25px;
            margin: 25px 0;
            border-radius: 10px;
            text-align: left;
            box-shadow: 0 5px 20px rgba(245, 87, 108, 0.1);
        }
        
        .error-title {
            color: #f5576c;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        
        .error-message {
            color: #c62828;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            word-break: break-all;
            background: rgba(255, 255, 255, 0.7);
            padding: 12px;
            border-radius: 5px;
            line-height: 1.5;
        }
        
        p {
            color: #666;
            margin: 15px 0;
            line-height: 1.8;
            font-size: 1.05em;
        }
        
        .checklist {
            text-align: left;
            color: #333;
            margin: 25px 0;
        }
        
        .checklist li {
            margin: 12px 0;
            padding-left: 25px;
            position: relative;
            font-size: 1em;
        }
        
        .checklist li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #f5576c;
            font-weight: bold;
            font-size: 1.2em;
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 30px;
            }
            
            h1 {
                font-size: 2em;
            }
            
            .icon-wrapper {
                font-size: 3em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon-wrapper">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h1>เกิดข้อผิดพลาด</h1>
        <p>ไม่สามารถเชื่อมต่อฐานข้อมูลได้ในขณะนี้</p>
        
        <div class="error-box">
            <div class="error-title">รายละเอียดข้อผิดพลาด:</div>
            <div class="error-message">${err.message}</div>
        </div>
        
        <p>โปรดตรวจสอบสิ่งต่อไปนี้:</p>
        <ul class="checklist">
            <li>DATABASE_URL มีค่าถูกต้องและตั้งค่าแล้ว</li>
            <li>ชื่อตาราง "students" มีอยู่ในฐานข้อมูล</li>
            <li>การเชื่อมต่ออินเทอร์เน็ตของเซิร์ฟเวอร์ปกติ</li>
            <li>สิทธิ์การเข้าถึงฐานข้อมูลถูกต้อง</li>
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
