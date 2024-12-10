"use client";

export default function Bookshelf() {
  return (
    <div className="h-[100%]">
      <main>
        <header className="flex w-[100vw] justify-between text-[1.5vw] px-16 pt-5 text-center">
          <div className="w-[15vw]">
            BOOKSHELFFLE
          </div>
          <div className="w-[15vw] bg-cover bg-no-repeat bg-center rounded-lg" style={{
            backgroundImage: "url('/book.png')",
          }}>
            HOME
          </div>
          <div className="w-[15vw] bg-cover bg-no-repeat bg-center rounded-lg" style={{
            backgroundImage: "url('/book.png')",
          }}>
            NEW SHUFFLE
          </div>
          <div className="w-[15vw] bg-cover bg-no-repeat bg-center rounded-lg" style={{
            backgroundImage: "url('/book.png')",
          }}>
            MY BOOKSHELF
          </div>
          <div className="w-[15vw] bg-cover bg-no-repeat bg-center rounded-lg" style={{
            backgroundImage: "url('/book.png')",
          }}>
            SHUFFLE HISTORY
          </div>
          <div className="w-[15vw]">
            USER
          </div>
        </header>
        <div className="h-[1vw] w-[100vw] bg-cover" style={{
            backgroundImage: "url('/shelf.png')",
          }}>
        </div>
        <section className="py-[5vh] px-[5vw] flex flex-col items-center place-self-center content-center text-center w-[100vw] bg-fixed bg-cover">
          <h2 className="text-[2rem]">New Shuffle</h2>
          <div className="flex gap-2 mt-[3vh]">
              <div className="w-[15vw] h-[35vh] bg-gray-200 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-100"></div>
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-200 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-100"></div>
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-200 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-100"></div>
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-200 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-100"></div>
              </div>
              <div className="w-[15vw] h-[35vh] bg-gray-200 rounded-xl overflow-hidden">
                <div className="w-[100%] h-[15%] bg-gray-100"></div>
              </div>
            </div>
            <label>
              <input
                type="checkbox"
              />
                EXCLUDE BOOKS ALREADY READ
            </label>
            <form>
              <label>
                <input
                  type="radio"
                  name="options"
                  value="bookshelf"
                />
                FROM MY BOOKSHELF ONLY
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="options"
                  value="global"
                />
                FROM GLOBAL READS ONLY
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="options"
                  value="mix"
                />
                MIX MY BOOKSHELF AND GLOBAL READS
              </label>
            </form>
            <div className="w-[50vw] bg-gray-200 my-[2%] rounded-xl">
              <p>SHUFFLE</p>
            </div>
        </section>
        <section className="py-[5vh] px-[5vw] flex flex-col items-center place-self-center content-center text-center w-[100vw] bg-fixed bg-cover">
          <h2 className="text-[2rem]">My Bookshelf</h2>
          
        </section>
        <section className="py-[5vh] px-[5vw] flex flex-col items-center place-self-center content-center text-center w-[100vw] bg-fixed bg-cover">
          <h2 className="text-[2rem]">Shuffle History</h2>
          
        </section>
      </main>
    </div>
  );
}
