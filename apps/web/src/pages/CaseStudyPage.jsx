import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CaseStudyDetail from "../components/testimonials/CaseStudyDetail";
import { useCaseStudies } from "../hooks/useCaseStudies";

const CaseStudyPage = () => {
  const { slug } = useParams();
  const { fetchCaseStudyBySlug } = useCaseStudies();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCaseStudy();
  }, [slug]);

  const loadCaseStudy = async () => {
    setLoading(true);
    setError(null);

    const data = await fetchCaseStudyBySlug(slug);

    if (data) {
      setCaseStudy(data);
    } else {
      setError("Case study not found");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Loading case study...
          </p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Case Study Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error ||
              "The case study you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Testimonials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="max-w-5xl mx-auto mb-8">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold"
          >
            <ArrowLeft size={18} />
            Back to Testimonials
          </Link>
        </div>

        {/* Case Study Detail */}
        <CaseStudyDetail caseStudy={caseStudy} />
      </div>
    </div>
  );
};

export default CaseStudyPage;
