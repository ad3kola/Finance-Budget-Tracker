import CardCarousel from "@/components/manage/CardCarousel";
import TotalBalance from "@/components/manage/TotalBalance";

function page() {
  return (
    <main className="p-2 grid grid-cols-4 w-full h-full gap-2">
      <div className="col-span-3">
        <TotalBalance />
      </div>
      <div className="col-span-1 w-full ">
          <CardCarousel />
        </div>
    </main>
  );
}

export default page;
