import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

const CompletionStep = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl shadow-xl">
          <div className="relative h-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-primary-foreground/10" />
          </div>

          <div className="bg-card px-6 sm:px-8 pb-10 pt-8 relative text-center">
            <div className="mb-6 flex justify-center">
              <Logo className="h-16 w-auto" variant="black" />
            </div>

            <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary mb-4">
              Thank you for completing your profile!
            </h2>
            <p className="text-sm text-foreground leading-relaxed max-w-sm mx-auto">
              Please keep an eye on your email, as we will send you a message shortly to schedule your screening interview.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompletionStep;
