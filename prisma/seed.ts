import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data to avoid duplicates
  await prisma.college.deleteMany()

  const colleges = [
    { name: "IIT Bombay", location: "Mumbai", state: "Maharashtra", stream: "Engineering", cutoff: 99.8, fees: 210000, rating: 4.9, logo: "🏛️" },
    { name: "IIT Delhi", location: "New Delhi", state: "Delhi", stream: "Engineering", cutoff: 99.5, fees: 225000, rating: 4.8, logo: "🏫" },
    { name: "BITS Pilani", location: "Pilani", state: "Rajasthan", stream: "Engineering", cutoff: 98.2, fees: 530000, rating: 4.7, logo: "🎓" },
    { name: "RV College of Engineering", location: "Bengaluru", state: "Karnataka", stream: "Engineering", cutoff: 97.5, fees: 250000, rating: 4.5, logo: "🚀" },
    { name: "PES University", location: "Bengaluru", state: "Karnataka", stream: "Engineering", cutoff: 96.0, fees: 410000, rating: 4.4, logo: "💻" },
    { name: "IIM Ahmedabad", location: "Ahmedabad", state: "Gujarat", stream: "Management", cutoff: 99.9, fees: 1200000, rating: 4.9, logo: "📊" },
    { name: "IIM Bangalore", location: "Bengaluru", state: "Karnataka", stream: "Management", cutoff: 99.7, fees: 1150000, rating: 4.8, logo: "📈" },
    { name: "Kasturba Medical College", location: "Manipal", state: "Karnataka", stream: "Medical", cutoff: 95.2, fees: 1780000, rating: 4.6, logo: "🩺" },
    { name: "AIIMS New Delhi", location: "New Delhi", state: "Delhi", stream: "Medical", cutoff: 99.6, fees: 5000, rating: 4.9, logo: "🏥" },
    { name: "St. Xavier's College", location: "Mumbai", state: "Maharashtra", stream: "Arts & Science", cutoff: 92.0, fees: 45000, rating: 4.3, logo: "🎨" }
  ];

  for (const college of colleges) {
    await prisma.college.create({ data: college })
  }
  console.log("Seeding complete!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
