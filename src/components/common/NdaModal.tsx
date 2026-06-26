import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface NdaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
}

const NdaModal = ({ open, onOpenChange, onAgree }: NdaModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (open) {
      setScrolledToEnd(false);
      setAgreed(false);
      // Reset scroll position
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      });
    }
  }, [open]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
      setScrolledToEnd(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">Agreement</DialogTitle>
        </DialogHeader>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto pr-3 -mr-3 text-sm leading-relaxed text-foreground/90 space-y-4 border-y py-4"
          style={{ maxHeight: '55vh' }}
        >
          <div className="text-center">
            <h3 className="font-bold text-base">NON-DISCLOSURE AGREEMENT</h3>
            <p className="font-semibold">PRIOR INTERVIEW PROCESS</p>
          </div>

          <div>
            <p className="font-semibold">WARNING: No Recording and Copying</p>
            <p>
              The Applicant shall not record, publish, or make a copy of the application process or any contract and document related hereto. The application process is the Cyberbacker, Inc.'s proprietary and intellectual property, therefore any reproduction, recording or reenactment of the application process is prohibited. In the event that the applicant records and copies this application process or any other document hereof, the applicant shall forfeit his/her application to Cyberbacker Inc. and may subject the Applicant to appropriate legal action, subject to applicable law.
            </p>
          </div>

          <div>
            <p className="font-semibold">No Conflict of Interest/ Affiliation clause</p>
            <p>
              The Applicant acknowledges that, in the event of successful progress through the Cyberbacker Inc. application process until the interview, the Applicant will promptly terminate any existing affiliations, any actual or potential conflicts of interest, or engagements with other organizations, competing businesses, or employment.
            </p>
          </div>

          <div>
            <p className="font-semibold">Authorization</p>
            <p>
              The Applicant hereby declares that all information provided in this form is true, correct and complete to the best of their knowledge. Any material misrepresentation or falsification may result in disqualification from the application process or termination of any engagement, subject to applicable law.
            </p>
            <p className="mt-2">
              The Applicant hereby authorizes Cyberbacker Inc., its representatives, agents, and/or third-party providers to verify and confirm any and all information pertaining to the Applicant's educational, employment, and personal background and history, including but not limited to the information that the applicant provided in their application.
            </p>
            <p className="mt-2">
              The Applicant acknowledges and consents to the collection, processing, and sharing of personal data and sensitive personal information with Cyberbacker Inc., its authorized representatives, and service providers, strictly for legitimate recruitment and evaluation purposes and in accordance with applicable data privacy laws.
            </p>
            <p className="mt-2">
              The Applicant understands that such personal data shall be handled in accordance with applicable data protection laws, and may be retained only for as long as necessary to fulfill the purposes of the application process and in accordance with the Company's retention policies.
            </p>
            <p className="mt-2">
              The Applicant acknowledges their rights under applicable data privacy laws, including rights of access, correction, objection, and deletion, subject to legal and regulatory limitations.
            </p>
            <p className="mt-2">
              The Applicant confirms that this declaration is made voluntarily, without coercion, force, or intimidation, and that they fully understand its contents and implications.
            </p>
          </div>

          <div className="text-center pt-2">
            <h3 className="font-bold text-base">NON-DISCLOSURE AGREEMENT FOR ASPIRING CYBERBACKERS</h3>
          </div>

          <p>This Non-Disclosure Agreement is made and entered between:</p>
          <p>
            <strong>Cyberbacker Inc.</strong>, a corporation duly organized and existing under the laws of the United States of America, with office address at 2447 Kiesel Ave Ogden, Utah 84401 represented by its President Shiela Mie Legaspi, hereinafter referred to as "Cyberbacker Inc."
          </p>
          <p>and</p>
          <p>
            I, the Applicant, of legal age, with sound mind and discretion, an applicant for Cyberbacker Inc. hereinafter referred to as "Applicant".
          </p>
          <p>
            The parties agree to enter into a confidential relationship with respect to the disclosure of certain intellectual, proprietary, and confidential information ("Confidential Information"), including personal and device related information necessary for the application and assessment process.
          </p>

          <div>
            <p><strong>1. Purpose.</strong> This Non-Disclosure Agreement (the "Agreement") is created for the purpose of preventing the unauthorized disclosure of confidential and proprietary information of Cyberbacker Inc., to third parties, unauthorized persons, and its competitors.</p>
          </div>
          <div>
            <p><strong>2. Definition of Confidential Information.</strong> "Confidential Information" means all non-public, proprietary, or sensitive information disclosed by Cyberbacker Inc. to the Applicant, whether oral, written, electronic, or in any other form, that is designated as confidential or would reasonably be understood as such under the circumstances.</p>
            <p className="mt-2">Confidential Information includes, but is not limited to, application processes, procedures, market niche, marketing strategies, intellectual property, know-how, methods, techniques, documents, trade secrets, assets, operational methods, contractual information, and other similar materials disclosed in connection with the application process or any interaction with Cyberbacker Inc.</p>
            <p className="mt-2">For purposes of the application process, Confidential Information also includes device specifications and related technical data collected through the Profile Builder platform, which may be used for candidate assessment, profile building, system optimization, and client matching purposes.</p>
            <p className="mt-2">Confidential Information further includes any personal data or sensitive personal information belonging to Cyberbacker Inc., its clients, employees, contractors, or end users that the Applicant may access, receive, or process in connection with the application or potential engagement.</p>
            <p className="mt-2">Confidential Information does not include information that:</p>
            <p className="ml-4">(a) is or becomes publicly available through no breach of this Agreement;</p>
            <p className="ml-4">(b) was already lawfully known to the Applicant without restriction prior to disclosure;</p>
            <p className="ml-4">(c) is received from a third party not under any confidentiality obligation; or</p>
            <p className="ml-4">(d) is independently developed by the Applicant without reference to or use of Cyberbacker Inc.'s Confidential Information.</p>
          </div>
          <div>
            <p><strong>3. Obligations of Applicant.</strong> The Applicant shall hold and maintain the Confidential Information in the strictest confidence for the sole and exclusive benefit of Cyberbacker Inc. The Applicant shall not, without the prior written approval of Cyberbacker Inc., use for the Applicant's own benefit, publish, copy, upload in internet platforms, or otherwise disclose to others, or permit the use by others for their benefit or to the detriment of Cyberbacker Inc., any Confidential Information. The Applicant shall return to Cyberbacker Inc. any and all records, notes, and other written, printed, or tangible materials in its possession pertaining to Confidential Information immediately. The Applicant shall immediately: (a) remove or destroy any and all tangible or intangible material acquired through any means; (b) give notice and submit proof to Cyberbacker Inc. of the actual destruction and removal of the same.</p>
          </div>
          <div>
            <p><strong>4. Data Privacy Notice, Consent, and Rights of the Applicant.</strong></p>
            <p className="mt-2">Cyberbacker Inc. acts as the Personal Information Controller (PIC) with respect to personal data and device specifications collected through the application process. Cyberbacker Inc. may be contacted through its designated email address: <a href="mailto:careerbacker@cyberbacker.com" className="text-primary hover:underline">careerbacker@cyberbacker.com</a></p>
            <p className="mt-2">The Applicant expressly acknowledges and consents to the collection, processing, storage, and use of personal data and device specifications for purposes of candidate assessment, profile building, and client matching, in accordance with applicable data privacy laws and internal policies.</p>
            <p className="mt-2">Device specification data shall be retained only for as long as necessary to fulfill the stated purposes or as required under applicable law and Cyberbacker Inc.'s internal data retention policies, after which such data shall be securely deleted or anonymized.</p>
            <p className="mt-2">The Applicant is informed of their rights under applicable Data Privacy Laws, including the rights to be informed, access, correction, objection, erasure or blocking, data portability, and to lodge a complaint with the appropriate regulatory authority, subject to the conditions and limitations provided by law.</p>
          </div>
          <div>
            <p><strong>5. Specific Performance; Indemnification; Notification.</strong> The Applicant acknowledges that Cyberbacker Inc. shall suffer irreparable damages resulting directly or indirectly in the event that the terms and conditions of this Agreement are violated. Further, Cyberbacker Inc. is entitled to damages, and shall seek an injunction to prevent Applicant from violating, or continuing to violate, this Agreement, notwithstanding, any other rights, remedies, or courses of action available under the law. The Applicant hereby undertakes to exempt Cyberbacker Inc. from any harm, loss, claim, liability, or expense attributable to or resulting from the Applicant's use or disclosure of Confidential Information without any authorization from the former. Furthermore, Applicant shall fully cooperate in any effort made by Cyberbacker Inc. to secure, protect, and redress such unauthorized use or disclosure. Finally, the Applicant hereby undertakes that he or she shall immediately notify Cyberbacker Inc. such Applicant becomes aware of any unauthorized disclosure or use of such Confidential Information.</p>
          </div>
          <div>
            <p><strong>6. Time Periods.</strong> Unless otherwise released in writing, the terms and conditions of this Agreement shall remain effective and bind the Applicant until such Confidential Information, as determined by Cyberbacker, Inc., no longer qualifies as a trade secret or beneficial to Cyberbacker, Inc.</p>
          </div>
          <div>
            <p><strong>7. Relationships.</strong> Nothing in this Agreement shall be construed to constitute the Applicant as a partner, joint venture, independent contractor, or employee of Cyberbacker Inc.</p>
          </div>
          <div>
            <p><strong>8. Severability.</strong> If any provision of this Agreement is hereafter declared invalid, illegal, or unenforceable under the law, all other provisions of this Agreement shall remain in full force and effect.</p>
          </div>
          <div>
            <p><strong>9. Governing Law.</strong> This Agreement is governed by, construed, applied, and enforced in accordance with laws of the State of Utah, without giving effect to its conflict of laws principles.</p>
          </div>
          <div>
            <p><strong>10. Waiver.</strong> Nothing herein or hereafter shall be construed as a waiver by Cyberbacker, Inc. to enforce its rights under this Agreement and to undertake courses of action available under the law.</p>
          </div>
          <div>
            <p><strong>11. Effective Date and Acceptance.</strong> This Non-Disclosure Agreement shall become effective and binding on the date and time the Applicant submitted "I agree" before taking the Values Assessment.</p>
          </div>

          <p className="italic">
            I, the Applicant, acknowledge that I have read this Non-Disclosure Agreement in its entirety and hereby undertake to comply with its terms and conditions. I understand that I am required to abide by the provisions of this agreement in order to move forward with the Values Assessment and other phases of this application process. Failure to agree will render my application to Cyberbacker Inc. void and forfeited.
          </p>
        </div>

        <div className="space-y-3">
          {!scrolledToEnd && (
            <p className="text-xs text-muted-foreground text-center">
              Please scroll to the bottom to continue.
            </p>
          )}
          {scrolledToEnd && (
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground">
                I have read and agree to the terms of the Non-Disclosure Agreement.
              </span>
            </label>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-outline"
          >
            Cancel
          </button>
          {scrolledToEnd && agreed && (
            <button
              type="button"
              onClick={onAgree}
              className="btn-primary"
            >
              Continue
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NdaModal;
