import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalog: Record<string, { title: string; author: string; isbn: string; year: number }[]> = {
  'Science Fiction': [
    { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', year: 1965 },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', year: 1984 },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', year: 1969 },
    { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', year: 1951 },
  ],
  'African Literature': [
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', year: 1958 },
    { title: 'A Grain of Wheat', author: 'Ngũgĩ wa Thiong\'o', isbn: '9780143026327', year: 1967 },
    { title: 'Weep Not, Child', author: 'Ngũgĩ wa Thiong\'o', isbn: '9780435908300', year: 1964 },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '9781400095209', year: 2006 },
  ],
  'Technology': [
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', year: 2008 },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '9780135957059', year: 2019 },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', year: 2017 },
    { title: 'The Phoenix Project', author: 'Gene Kim et al.', isbn: '9781942788294', year: 2013 },
  ],
  'History': [
    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316110', year: 2011 },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317558', year: 1997 },
    { title: 'The Shadow of the Sun', author: 'Ryszard Kapuściński', isbn: '9780679738435', year: 1998 },
    { title: 'Africa: A Biography of the Continent', author: 'John Reader', isbn: '9780679738510', year: 1997 },
  ],
};

async function main() {
  // Clear in dependency order so the seed is re-runnable
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  for (const [genreName, books] of Object.entries(catalog)) {
    await prisma.genre.create({
      data: {
        name: genreName,
        books: {
          create: books.map((b) => ({
            title: b.title,
            author: b.author,
            isbn: b.isbn,
            publishedYear: b.year,
            totalCopies: 3,
          })),
        },
      },
    });
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.createMany({
      data: [
        { email: 'librarian@library.test', name: 'Lib Rarian', role: 'LIBRARIAN', password: passwordHash },
        { email: 'patron@library.test', name: 'Pat Ron', role: 'PATRON', password: passwordHash },
      ],
  });

  const [genres, books] = await Promise.all([prisma.genre.count(), prisma.book.count()]);
  console.log(`Seeded ${genres} genres and ${books} books`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());