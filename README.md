## Schema Decisions

### Why Book references Genre instead of embedding it
Each `Book` stores a `genreId` foreign key pointing to a row in the `Genre` table rather than copying the genre's data into the book.

- **Single source of truth:** a genre's name lives in one place. Renaming "Sci-Fi" to "Science Fiction" is one update, not an update across every book.
- **No inconsistency:** embedding would allow typos and variants ("History", "history", "Histroy") to creep in across books.
- **Genres are shared, many-to-one:** many books belong to one genre, so it's a natural relation. Duplicating it per book wastes storage and makes querying "all books in a genre" depend on string matching.
- **Referential integrity:** the database enforces that a book can't point to a genre that doesn't exist.
- **Efficient queries:** the `genreId` is indexed, and Prisma can fetch a book with its genre via `include: { genre: true }`.

### Other decisions
- `Role` is an enum (`PATRON`, `LIBRARIAN`) so invalid roles can't be stored; default is `PATRON`.
- `isbn` and `email` are `@unique` to prevent duplicate books and accounts.
- `Review` links a `User` to a `Book`, with `@@unique([bookId, userId])` so a user can review a book only once.

### Prisma vs. a document database
In a document database like MongoDB, my first instinct would be to embed the genre (or even reviews) inside each book document. In Prisma I had to define the schema up front and model relations explicitly, and the database refuses data that breaks them. It felt stricter, but it caught mistakes early, and the generated types made queries feel safer.