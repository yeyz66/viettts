import NavBar from '../components/navbar';
import MinutesPricing from '../components/minutes-pricing';
import Footer from '../components/footer';

export default function PricingPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-950 flex-1">
          <MinutesPricing />
        </div>
      </main>
      <Footer />
    </>
  );
} 