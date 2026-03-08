import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const ExpiroLogo = () => (
  <Link href="/" className="flex items-center max-w-60 gap-3 select-none">
    <motion.div
      whileHover={{ rotate: [0, -8, 8, 0] }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={"/logo.png"}
        alt="logo Image"
        width={106}
        height={106}
        className="size-18"
      />
    </motion.div>

    <div className="leading-none text-start">
      <p className="text-[#1B5E35] font-bold text-4xl  tracking-tight leading-none font-dm">
        expiro
      </p>
      <p className="mt-0.5 max-w-41.25 text-sm font-dm font-medium leading-snug bg-linear-to-r  from-[#3A7326] to-[#86EA63] bg-clip-text text-transparent">
        La traçabilité qui anticipe vos DLC
      </p>
    </div>
  </Link>
);

export default ExpiroLogo;
