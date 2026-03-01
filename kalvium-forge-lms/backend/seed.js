const { run } = require('./services/db.service');

async function seedDatabase() {
    console.log("🌱 Seeding database...");
    try {
        // 1. Insert Student
        await run(`INSERT INTO students (id, full_name, email, password, phone, date_of_birth, city) 
                   VALUES (1, 'Jhon Doe', 'jhondoe@gmail.com', 'password123', '+91 9876543210', '2005-04-18', 'Bangalore')`);
        
        // 2. Insert Education
        await run(`INSERT INTO education_details (student_id, tenth_board, tenth_percentage, twelfth_board, twelfth_percentage) 
                   VALUES (1, 'SSLC', 70, 'TN HSC', 90)`);

        // 3. Insert Course
        await run(`INSERT INTO courses (id, title, duration_months, fee) 
                   VALUES (1, 'Gen AI', 6, 7000)`);

        // 4. Insert Application (Links Student to Course)
        await run(`INSERT INTO applications (student_id, course_id, status) 
                   VALUES (1, 1, 'accepted')`);

        console.log("✅ Database seeded successfully!");
    } catch (err) {
        console.error("❌ Seeding failed. You might have already seeded it:", err.message);
    }
}

seedDatabase();