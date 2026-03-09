import Image from "next/image";

function NotFound() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src={"/images/not_found.png"}
        alt="not found image"
        width={362}
        height={426}
        className="object-center"
      />
    </div>
  );
}

export default NotFound;
