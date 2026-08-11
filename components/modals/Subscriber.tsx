import Image from "next/image";
import bgSubscriber from '@/public/bgImage/Subscriber-bg.webp'


export default function Subscriber(){
  return (
    <div className="relative bg-black
                    max-w-200 w-200 max-h-400 h-70 mx-auto 
                    overflow-hidden ">

      {/* bg image */}
      <div className="absolute z-0 w-full h-full ">
        <Image src={bgSubscriber} alt="Subscriber bg  images" ></Image>
      </div>

      {/* conent */}
      <div className="relative w-full h-full p-20  text-blue-600 ">
        <div>
        <h2>Become a subscriber</h2>
        <p>Subscribe to get the notification of latest posts</p>
        </div>

        <div>
          <form action="" method="post">
            <input 
              type="email" 
              name="email" 
              id=""
              placeholder="Your email address"
              className="border" 
            />
            <input type="submit" value="" />
          </form>


          {/* <option value="">{"Don't show this popup again"}</option>
          <option value="">{"Don't show this popup again"}</option> */}


          <input type="radio" name="hell" id=""   />
        </div>
      </div>



    </div>
  )
}