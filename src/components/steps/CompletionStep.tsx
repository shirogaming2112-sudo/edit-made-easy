import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

const CompletionStep = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl shadow-xl">
          <div className="relative h-24 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-accent" />
            <div className="absolute inset-0 bg-linear-to-bl from-transparent to-primary-foreground/10" />
          </div>

          <div className="bg-card px-6 sm:px-8 pb-10 pt-8 relative text-center">
            <div className="mb-6 flex justify-center">
              <Logo className="h-16 w-auto" variant="black" />
            </div>

            <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary mb-4">
              Thank you for building your profile with Cyberbacker!
            </h2>
            <ul className="list-disc pl-5 mt-1 space-y-0.5 max-w-md">
              <li className="text-sm text-foreground text-left leading-relaxed mx-auto mb-2">
                Our team will review your profile, submitted requirements, and Values Assessment as part of our compliance process. This review is typically completed within 24–48 business hours.
              </li>
              <li className="text-sm text-foreground text-left leading-relaxed mx-auto mb-2">
                Once your profile has been reviewed, we will email you the outcome of your evaluation.
              </li>
              <li className="text-sm text-foreground text-left leading-relaxed mx-auto mb-2">
                If qualified, you will be invited to an interview with one of our Career Consultants as the next step of the Talent Success Journey.  
              </li>
              <li className="text-sm text-foreground text-left leading-relaxed mx-auto mb-2">
                Please check your inbox regularly, including spam or junk folders, to avoid missing any updates.
              </li>
            </ul>
            {/* Added Comment  hey hey*/}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompletionStep;
