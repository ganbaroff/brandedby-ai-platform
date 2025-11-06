import EmailJSSetup from "@/react-app/components/EmailJSSetup";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";

export default function EmailSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <EmailJSSetup />
      </div>

      <Footer />
    </div>
  );
}