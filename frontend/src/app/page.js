"use client";

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
        setIsOpen(!isOpen)
        menu.style.pointerEvents = 'none';
      }
    };


    window.addEventListener("scroll", handleScroll);
  }, []);

  const [author, setAuthor] = useState("");
  const [authorsSuggestions, setAuthorsSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAuthors = async (query) => {
    if (!query) {
      setAuthorsSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/authors?query=${query}`);
      const data = await response.json();
      setAuthorsSuggestions(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (author) {
        fetchAuthors(author);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [author]);

  const handleInputChange = (event, type) => {
    const query = event.target.value;
    if (type === "author") {
      setAuthor(query);
    }
  };

  return (
    <div className="h-[100%]">
      <main >
          <div
            id="menu"
            ref={menuRef}
            className={`ml-12 bg-bottom bg-cover bg-no-repeat w-[17vw] fixed flex justify-center items-center transition-all duration-300 z-10 cursor-pointer ${
            isOpen ? "h-[95vh]" : "h-[30vh] hover:h-[33vh]"
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
          className="py-[10vh] px-[22vw] flex flex-col items-center place-self-center justify-evenly content-center text-center h-[100vh] w-[100vw] bg-fixed bg-cover"
          style={{
            backgroundImage: "url('/bg.png')",
          }}
        >
          <div className="flex flex-col items-center">
            <Image
              className="w-[10vw] "
              src="/icon.png"
              alt="Page Icon"
              width={1000}
              height={1000}
              priority
            />
            <h1 className="text-[5vw]">BookShelffle</h1>
          </div>
          <div className="text-[1.8vw]">
            <p className="font-light">Stuck on what to read next?</p>
            <p className="pt-[5vh]">
              Let us randomly pick a book from <strong>your own collection</strong>, from <strong>global reads</strong>, or <strong>mix it up</strong> for
              the ultimate surprise.
            </p>
            <p className="py-[3vh]">
              Now you don't have to decide on your own!
            </p>
          </div>
          <div className="flex gap-10 justify-center flex-wrap text-black">
            <Link href="/my-bookshelf">
              <div className="py-5 px-4 bg-[#ffc425] hover:bg-[#FFE082] rounded-2xl flex gap-3 justify-center shadow-inner shadow-[#2d2d2d5e]">
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
            <div className="py-5 px-4 bg-[#ffc425] hover:bg-[#FFE082] rounded-2xl flex gap-3 justify-center shadow-inner shadow-[#2d2d2d5e]">
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
            <Link href="/my-bookshelf">
              <div className="py-5 px-4 bg-[#ffc425] hover:bg-[#FFE082] rounded-2xl flex gap-3 justify-center shadow-inner shadow-[#2d2d2d5e]">
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
        </section>
        <section
          id="shuffle"
          className="pl-[25vw] pr-[5vw] flex flex-col items-center place-self-center justify-evenly content-center text-center h-[100vh] w-[100vw]"
        >
          <div className="w-[100%] text-[1vw]">
            <h1 className="text-[2vw] py-[2vh] font-bold">Shuffle</h1>
            <p>Looking for a book on a specific subject, author, or genre? Select it and shuffle.</p>
            <p>Or simply shuffle if you're not sure where to start.</p>
              <div className="flex gap-2 pt-[4vh]">
                <div className="w-[15vw] h-[35vh] bg-gray-100 rounded-xl overflow-hidden scrollbar overflow-y-scroll scroll-smooth">
                  <input
                    className="w-[100%] h-[15%] bg-gray-200 roundex-xl outline-0 p-[1vw]"
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => handleInputChange(e, "author")}
                  />
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  author && (
                    <div className="px-[1vw]">
                      {authorsSuggestions.length > 0 ? (
                        authorsSuggestions.map((author, index) => (
                          <label key={index} className="flex justify-between">
                            {author || "Unknown"}
                            <input
                              className="w-[2vh] h-[2vh] text-yellow-600"
                              type="checkbox"
                            />
                          </label>
                        ))
                      ) : (
                        <div>No authors found</div>
                      )}
                    </div>
                  )
                )}
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-100 rounded-xl overflow-hidden scrollbar overflow-y-scroll scroll-smooth">
                <div className="w-[100%] h-[15%] bg-gray-200 roundex-xl px-[1vw] flex justify-between items-center">
                  <input
                    className="w-[80%] bg-transparent outline-0 flex"
                    type="text"
                    placeholder="Keyword"
                  />
                  <p className="w-[1vw] h-[1vw] bg-white shadow-inner rounded-full flex items-center justify-center">+</p>
                  </div>
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-100 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-200">
                </div>
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-100 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-200">
                </div>
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-100 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-200">
                </div>
              </div>
            </div>
            <div className="w-[100%] bg-gray-200 my-[2%] rounded-xl">
              <p>SHUFFLE</p>
            </div>
            <div className="w-[100%]">
              <h3 className="text-left">Result</h3>
              <div className="flex gap-5 h-[27vh]">
                <div className="w-[10vw] h-[100%] bg-gray-200">
                </div>
                <div className="text-left flex flex-col h-[100%] justify-between">
                  <p>Title</p>
                  <p>Summary</p>
                  <div>rate
                    <p className="text-[1vw]">n ratings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="bookshelf"
          className="pl-[25vw] pr-[5vw] flex flex-col items-center place-self-center justify-evenly content-center text-center h-[100vh] w-[100vw]"
        >
          <div className="flex">
            <p>SIGN UP</p>
            <p>or</p>
            <p>SIGN IN</p>
          </div>
          <p>TO ACCESS YOUR <strong>PERSONAL BOOKSHELF</strong></p>
          <div>YOU REGISTER YOUR BOOKS</div>
          <div>WE SHUFFLE YOUR OWN SHELF</div>
          <div>WE PICK YOUR NEXT READ</div>
        </section>
        <section
          className="pl-[25vw] pr-[5vw] flex flex-col items-center place-self-center justify-evenly content-center text-center h-[100vh] w-[100vw]"
        >
          <h3>USER'S PERSONAL BOOKSHELF</h3>
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
          <Link href="/my-bookshelf">MANEGE PERSONAL BOOKSHELF</Link>
          <div>SHUFFLE YOUR OWN SHELF</div>
          <div>MIX IT UP</div>
        </section>
        <section
          id="about" 
          className="pl-[25vw] pr-[5vw] flex flex-col items-center place-self-center justify-evenly content-center text-center h-[100vh] w-[100vw]"
        >

        </section>
      </main>
    </div>
  );
}
