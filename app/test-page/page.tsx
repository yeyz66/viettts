import NavBar from '../components/navbar';
import Footer from '../components/footer';

export default function TestPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">测试页面</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">如果您能看到这个页面，说明路由工作正常</p>
        </div>
      </main>
      <Footer />
    </>
  );
} 