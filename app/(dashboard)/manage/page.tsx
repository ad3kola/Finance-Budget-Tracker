
import CardCarousel from "@/components/manage/CardCarousel";

function page() {
  return (
    <main className="p-2">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <CardCarousel />
        <div className="col-span-1 md:col-span-2"></div>
      </div>
    </main>
  );
}

export default page;
