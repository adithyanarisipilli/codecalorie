import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className=" flex flex-col sm:flex-row p-3 border border-orange-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col items-center">
        <h2 className="text-2xl">Meet Adithya Narisipilli</h2>
        <p className="text-orange-500 my-2">
          Checkout Adithya's LinkedIn profile for more details
        </p>
        <Button
          gradientDuoTone="pinkToOrange"
          className="rounded-tl-xl rounded-bl-none mb-3"
        >
          <a
            href="https://www.linkedin.com/in/adithya-narisipilli-59a3b025a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn Profile
          </a>
        </Button>
      </div>
    </div>
  );
}
