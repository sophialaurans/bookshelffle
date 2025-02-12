"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import years from './data/years';
import ratings from './data/ratings';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [authorsSuggestions, setAuthorsSuggestions] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAuthor, setLoadingAuthor] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [result, setResult] = useState([]);
  const [resultError, setResultError] = useState("");
  const user = null;

  // Handle menu interaction and scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!menuRef.current) return;

      const menu = menuRef.current;
      const scrollTop = window.scrollY;
      const homeHeight = window.innerHeight;

      if (scrollTop <= homeHeight && !isOpen) {
        menu.style.pointerEvents = 'auto';
      } else if (scrollTop <= homeHeight && isOpen) {
        menu.style.pointerEvents = 'auto';
      } else {
        setIsOpen(prev => !prev); // Usar função dentro do setState para evitar dependência direta
      }
    };

    window.addEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Fetch authors based on user input
  const fetchAuthors = async (query) => {
    if (!query) return;

    setLoadingAuthor(true);

    try {
      const response = await fetch(`http://localhost:5000/api/authors?query=${query}`);
      const data = await response.json();

      const uniqueAuthors = [...new Set(data.filter((author) => author && author.toLowerCase().includes(query.toLowerCase())))];
      setAuthorsSuggestions(uniqueAuthors);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoadingAuthor(false);
    }
  };

  // Fetch subjects based on user input
  const fetchCategories = async (query) => {
    if (!query) return;

    setLoadingCategory(true);

    try {
      const response = await fetch(`http://localhost:5000/api/subjects?query=${query}`);
      const data = await response.json();

      const uniqueSubjects = [...new Set(data.filter((category) => category && category.toLowerCase().includes(query.toLowerCase())))];
      setCategorySuggestions(uniqueSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoadingCategory(false);
    }
  };

  const fetchBooks = async () => {
    setLoading(true)
    const authorQuery = author ? category ? `inauthor:${author}+` : `inauthor:${author}` : 'a';
    const categoryQuery = category ? `subject:${category.replace(' ', '+')}` : '';

    const fullQuery = `${authorQuery}${categoryQuery}`;

    const queries = [
      `${fullQuery}`,
      `a+${fullQuery}`,
      `e+${fullQuery}`,
      `i+${fullQuery}`,
      `o+${fullQuery}`,
      `u+${fullQuery}`,
    ];

    const books = [];
    try {
      for (const query of queries) {
        const response = await fetch(`http://localhost:5000/api/books?query=${query}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          books.push(
            ...data.map(book => ({
              title: book.volumeInfo?.title || "N/A",
              author: book.volumeInfo?.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
              publishYear: book.volumeInfo?.publishedDate?.split('-')[0] || "N/A",
              isbn: book.volumeInfo?.industryIdentifiers
                ? book.volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_13")?.identifier ||
                  book.volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_10")?.identifier ||
                  "N/A"
                : "N/A",
              categories: book.volumeInfo?.categories || "N/A",
              averageRating: book.volumeInfo?.averageRating || "N/A",
              summary: book.volumeInfo?.description || "Unavailable",
              thumbnail: book.volumeInfo?.imageLinks ? book.volumeInfo?.imageLinks.thumbnail || book.volumeInfo.imageLinks.smallThumbnail : '/cover.png',
              rating: book.volumeInfo?.averageRating || "?",
              ratingsCount: book.volumeInfo?.ratingsCount || "0",
            }))
          );
        }
      }

      console.log("All books retrieved:", books);

      const filteredBooks = books.filter(book => {
        if (author) {
          
        }

        if (category) {
          return book.categories[0] === category;
        }

        if (year) {
          const [startYear, endYear] = year.split('-');
          return (
            Number(book.publishYear) >= Number(startYear) &&
            Number(book.publishYear) <= Number(endYear)
          );
        }

        if (rating) {
          return Math.floor(book.averageRating) === Number(rating);
        }

        return true;
      });

      if (filteredBooks.length > 0) {
        console.log("Filtered books:", filteredBooks);
        const randomIndex = Math.floor(Math.random() * filteredBooks.length);
        const randomBook = filteredBooks[randomIndex];
        console.log("Random book:", randomBook);
        setResult(randomBook);
        setLoading(false);
        return randomBook;
      } else {
        console.warn("No book was found.");
        setLoading(false);
        setResultError("No book was found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching books", error);
      setLoading(false);
      setResultError("Error fetching books", error);
      return null;
    }
  };

  // Debounce input for fetching authors
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (author) fetchAuthors(author);
      if (category) fetchCategories(category);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [author, category]);

  return (
    <div>
      <main className="overflow-hidden">
          <div
            id="menu"
            ref={menuRef}
            className={`ml-12 bg-bottom bg-no-repeat w-[18vw] fixed flex justify-center items-center transition-all duration-300 z-10 cursor-pointer ${
            isOpen ? "min-h-[95vh] bg-cover" : "h-[30vh] bg-[100%-auto] hover:h-[33vh]"
          }`}
            style={{
              backgroundImage: "url('/bookmark.png')",
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`max-w-[13vw] absolute text-center mb-[20vh] transition-all duration-250 ${
                isOpen ? "opacity-100 block" : "opacity-0 hidden"
              }`}
              style={{ overflow: "hidden" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="py-[5vh] text-[100%] hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="0.6"
                  stroke="currentColor"
                  className="size-[4vw] inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <p>User Name</p>
              </div>
              <Link href="#home"><p className="py-[3vh] hover:text-white">Home</p></Link>
              <Link href="#shuffle"><p className="py-[3vh] hover:text-white">Shuffle</p></Link>
              <Link href="#bookshelf"><p className="py-[3vh] hover:text-white">Personal Bookshelf</p></Link>
              <Link href="#about"><p className="py-[3vh] hover:text-white">About</p></Link>
            </div>
          </div>
        <section
          id="home" 
          className="h-[100vh] pb-[8vh] pt-[4vh] px-[15vw] flex flex-col items-center place-self-center justify-evenly content-center text-center bg-[length:100%_100%]"
          style={{
            backgroundImage: "url('/bg.png')",
          }}
          >
          <div className={`${
                isOpen ? "ml-[10vw]" : "ml-0"
              }`}>
            <div className="flex flex-col items-center">
              <Image
                className="w-[15vw] "
                src="/icon.png"
                alt="Page Icon"
                width={1000}
                height={1000}
                priority
              />
            </div>
            <div className="text-[1.8em]">
              <p className="font-light">Stuck on what to read next?</p>
              <p className="pt-[5vh]">
                Let us randomly pick a book from
                <strong className="bg-[length:100%_100%]"
                  style={{
                    backgroundImage: "url('/blue-mark.png')",
                  }}
                  >
                    &nbsp;your own collection
                </strong>
                , from
                <strong className="text-nowrap bg-[length:100%_100%]"
                  style={{
                    backgroundImage: "url('/green-mark.png')",
                  }}
                  >
                    &nbsp;global reads
                  </strong>
                  , or
                  <strong className="text-nowrap bg-[length:100%_100%]"
                  style={{
                    backgroundImage: "url('/blue-green-mark.png')",
                  }}
                  >
                    &nbsp;mix it up
                  </strong>
                  &nbsp;for the ultimate surprise!
              </p>
              <p className="py-[3vh]">
                {`Now you don't have to decide on your own ;)`}
              </p>
            </div>
            <div className="flex gap-10 justify-center flex-wrap text-black">
              <Link href="">
                <div className="py-5 px-4 bg-[#ffc425] hover:bg-[#467bb3] rounded-2xl flex gap-3 justify-center shadow-inner shadow-[#2d2d2d17]">
                  <Image
                    className="max-w-[2vw] max-h-[2vw]"
                    src="/3.png"
                    alt="Icon"
                    width={300}
                    height={100}
                    priority
                  />
                  YOUR BOOKSHELF
                </div>
              </Link>
              <div className="py-5 px-4 bg-[#ffc425] hover:bg-[#0cf79e] rounded-2xl flex gap-3 justify-center shadow-inner shadow-[#2d2d2d17]">
                <Image
                  className="max-w-[2vw] max-h-[2vw]"
                  src="/4.png"
                  alt="Icon"
                  width={300}
                  height={100}
                  priority
                />
                GLOBAL READS
              </div>
              <Link href="">
                <div className="py-5 px-4 bg-[#ffc425] hover:bg-[#9ae6ed] rounded-2xl flex gap-3 justify-center shadow-inner shadow-[#2d2d2d17]">
                  <Image
                    className="max-w-[2vw] max-h-[2vw]"
                    src="/5.png"
                    alt="Icon"
                    width={300}
                    height={100}
                    priority
                  />
                  MIXED PICKS
                </div>
              </Link>
            </div>
          </div>
        </section>
        <section
          id="shuffle"
          className="pl-[20vw] flex flex-col items-center justify-evenly content-center text-center h-[100vh] bg-right bg-[length:100%_100%]"
          style={{backgroundImage: "url('/bg1.png')"}}
        >
          <div className="w-[100%] h-[100%] text-[1em] px-[5vw] py-[2vh] bg-right bg-[length:100%_100%] bg-no-repeat"
          style={{backgroundImage: "url('/openbook.png')"}}
          >
            <h1 className="text-[2em] py-6 font-bold">Shuffle</h1>
            <p>Looking for a book on a specific subject, author, or genre? Select it and shuffle.</p>
            <p>{`Or simply shuffle if you're not sure where to start.`}</p>
            
            <div className="flex justify-between pt-[2vh] flex-wrap">
              {/* Author Input */}
              <div className="relative flex flex-col w-[24%] shadow shadow-[#2d2d2d70] bg-[#e2e2e26e] p-5 rounded-xl h-[25vh] overflow-y-scroll scrollbar justify-between">
                <label htmlFor="author-input">Which author would you like to read?</label>
                <input
                  id="author-input"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Type an author name..."
                  className="border rounded px-2 py-1 w-full"
                />
                {loadingAuthor && <p>Loading...</p>}
                {author && !loadingAuthor && authorsSuggestions.length > 0 && (
                  <ul className="text-left">
                    {authorsSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => setAuthor(suggestion)}
                        className="cursor-pointer hover:bg-gray-200 p-2 border-b border-b-slate-200"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Category Selection */}
              <div className="relative flex flex-col w-[24%] shadow shadow-[#2d2d2d70] bg-[#e2e2e26e] p-5 rounded-xl h-[25vh] overflow-y-scroll scrollbar justify-between">
                <label htmlFor="category">Which subject or genre are you most interested in at the moment?</label>
                <input
                  id="category-input"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Type something..."
                  className="border rounded px-2 py-1 w-full"
                />
                {loadingCategory && <p>Loading...</p>}
                {category && loadingCategory === false && categorySuggestions.length > 0 && (
                  <ul className="text-left">
                    {categorySuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => setCategory(suggestion)}
                        className="cursor-pointer hover:bg-gray-200 p-2 border-b border-b-slate-200"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Year Selection */}
              <div className="relative flex flex-col w-[24%] shadow shadow-[#2d2d2d70] bg-[#e2e2e26e] p-5 rounded-xl h-[25vh] justify-between">
                <label htmlFor="year">From which time period would you like your next reading to be from?</label>
                <select id="years" name="years" className="border rounded px-2 py-1 w-full" onChange={(e) => setYear(e.target.value)}>
                  <option value="">Select a year range</option>
                  {years.map((years) => (
                    <option key={years.value} value={years.value}>
                      {years.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Selection */}
              <div className="relative flex flex-col w-[24%] shadow shadow-[#2d2d2d70] bg-[#e2e2e26e] p-5 rounded-xl h-[25vh] justify-between">
                <label htmlFor="rating">Choose the rating you would like your next reading to have.</label>
                <select id="ratings" name="ratings" className="border rounded px-2 py-1 w-full" onChange={(e) => {
                  setRating(e.target.value);
                }}>
                  <option value="">Select a rating</option>
                  {ratings.map((ratings) => (
                    <option key={ratings.value} value={ratings.value}>
                      {ratings.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shuffle Button */}
            <div
              className="w-[100%] bg-[#396d94] my-[2%] rounded-xl cursor-pointer hover:bg-[#70a7d1] text-center text-white py-2"
              onClick={fetchBooks}>
              <p>SHUFFLE</p>
            </div>

            {/* Result Section */}
            <div className="w-[100%]">
              {!result.title && !loading &&
                  <p className="text-[1em] pt-[10vh]">The book we select for you will appear here!</p>}
              {loading && 
              <div className="loading">
                  <div className="bookshelf_wrapper">
                    <ul className="books_list">
                      <li className="book_item first"></li>
                      <li className="book_item second"></li>
                      <li className="book_item third"></li>
                      <li className="book_item fourth"></li>
                      <li className="book_item fifth"></li>
                      <li className="book_item sixth"></li>
                    </ul>
                    <div className="shelf"></div>
                  </div>
                </div>}                
              {result.title && !loading && !resultError ?
                <div className="flex gap-5 h-[27vh] bg-no-repeat bg-[length:100%_100%]">
                  <div className="w-[9vw] h-[100%]">
                    <Image
                        src={result.thumbnail}
                        width={1000}
                        height={1000}
                        alt="Book Cover"
                        className="min-h-[70%]"
                      />
                  </div>
                  <div className="text-left flex flex-col h-[25vh] w-[100%] justify-between">
                    <p>Title: {result.title}</p>
                    <p>Author: {result.author}</p>
                    <p className="overflow-y-scroll scrollbar">Summary: {result.summary}</p>
                    <p>Publish Year: {result.publishYear}</p>
                    <div>
                      <p className="text-[1em]">Rate: {result.rating} ({result.ratingsCount} ratings)</p>
                    </div>
                </div>
              </div> : resultError}
            </div>
          </div>
        </section>
        {user === null ? <section
          id="bookshelf"
          className="pl-[25vw] pr-[5vw] flex flex-col items-center place-self-center justify-evenly content-center text-center h-[100vh] w-[100vw] bg-right bg-[length:100%_100%]"
          style={{backgroundImage: "url('/bg2.png')"}}
        >
          <div className="flex gap-2">
            <p className="font-bold text-[2em]">SIGN UP</p>
            <p className="content-center">or</p>
            <p className="font-bold text-[2em]">SIGN IN</p>
          </div>
          <div className="flex">TO ACCESS YOUR <div className="h-[2vw] w-[15vw] font-bold bg-[length:100%_100%]"
              style={{backgroundImage: "url('/highlighter.png')"}}
            >PERSONAL BOOKSHELF</div></div>
          <div className="w-[100%] px-[10vw]">
            <div className="relative transform transition-transform hover:-rotate-3 hover:translate-x-2 h-[20vh] w-[15vw] flex bg-[length:100%_100%] justify-center items-center justify-self-start"
              style={{backgroundImage: "url('/postit1.png')"}}
            >
              <p className="w-[80%] text-wrap">YOU REGISTER YOUR BOOKS</p>
            </div>
            <div className="relative transform transition-transform hover:rotate-3 hover:-translate-x-2 h-[22vh] w-[15vw] flex bg-[length:100%_100%] justify-center items-center justify-self-center"
              style={{backgroundImage: "url('/postit2.png')"}}
            >
              <p className="w-[80%] mt-[10%] text-wrap">WE SHUFFLE YOUR OWN SHELF</p>
            </div>
            <div className="relative transform transition-transform hover:rotate-3 hover:-translate-x-2 h-[20vh] w-[15vw] flex bg-[length:100%_100%] justify-center items-center justify-self-end"
              style={{backgroundImage: "url('/postit3.png')"}}
            >
              <p className="w-[80%] text-wrap">WE PICK YOUR NEXT READ</p>
            </div>
          </div>
        </section> : <section
          className="pl-[25vw] pr-[5vw] flex flex-col items-center place-self-center justify-evenly content-center text-center h-[100vh] w-[100vw]"
        >
          <h3>{`USER'S PERSONAL BOOKSHELF`}</h3>
          <div className="flex">
            <div className="w-[9vw] h-[27vh] bg-gray-200 hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-300 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-400 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-200 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-300 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-400 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-200 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-300 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-400 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-200 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-300 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-400 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-200 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-300 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-400 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-200 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-300 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
            <div className="w-[9vw] h-[27vh] bg-gray-400 -ml-[5vw] hover:translate-y-[-1vh] hover:z-10"></div>
          </div>
          <div className="flex w-[100%] justify-between">
            <p>n books total</p>
            <p>n already read books</p>
            <p>n saved shuffles</p>
          </div>
          <Link href="">MANEGE PERSONAL BOOKSHELF</Link>
          <div>SHUFFLE YOUR OWN SHELF</div>
          <div>MIX IT UP</div>
        </section>}
        <section
          id="about"
          className="pl-[25vw] pr-[30vw] flex flex-col pt-[4%] gap-[10vh] h-[100vh] bg-right bg-[length:100%_100%]"
          style={{backgroundImage: "url('/bg4.png')"}}
        >
          <div className="text-center flex flex-col gap-5">
            <p className="font-bold text-[2em] mb-[5vh]">Welcome to BookShelffle!</p>
              <div className="min-w-[35%] flex gap-5">
                <div className="relative">
                  <div className="h-[2vw] w-[100%] bg-[length:100%_100%] absolute -top-3"
                    style={{backgroundImage: "url('/marker2.png')"}}
                  >About Me</div>
                  <p className="h-[100%] border-4 border-dotted border-[#70a7d1] rounded-3xl p-[4%] pt-[10%] mb-[2%] content-center">{`Hi! I'm Sophia, a Systems Development student. I created this website as a personal project to learn, grow, and showcase in my portfolio.`}</p>
                </div>
                <div className="relative">
                  <div className="h-[2vw] w-[100%] bg-[length:100%_100%] absolute -top-3"
                    style={{backgroundImage: "url('/marker2.png')"}}
                  >Contact</div>
                  <p className="h-[100%] border-4 border-dotted border-[#70a7d1] rounded-3xl p-[4%] pt-[10%] content-center">If you have any suggestions or want to report a problem, feel free to send me an email at [your-email@example.com].</p>
                </div>
              </div>
              <div className="relative self-center">
                <div className="h-[2.5vw] w-[100%] bg-[length:100%_100%] absolute -top-2 left-[50%] -translate-x-[50%] content-center"
                      style={{backgroundImage: "url('/marker2.png')"}}
                >About BookShelffle</div>
                <p className="border-4 border-dotted border-[#70a7d1] rounded-3xl p-[8%] pt-[5%] ml-[1%] content-center">{`Sometimes, I find myself stuck, unsure of which book to pick up next, and end up not reading anything at all. If you've ever felt the same way, BookShelffle is for you!
                  I decided to create this platform to help simplify the decision-making process and make it easier for readers to dive into their next great book.`}
                </p>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}
