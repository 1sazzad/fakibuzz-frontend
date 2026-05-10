import { useEffect, useState } from "react";
import { apiEndpoints } from "../api/api";
import { Badge, Button, Card, EmptyState, ErrorMessage, LoadingSpinner, ResponsiveContainer } from "../components/ui";

function getErrorMessage(error) {
  const detail = error.response?.data?.detail || error.response?.data?.message;
  return typeof detail === "string" ? detail : error.message || "Unable to load donation info right now.";
}

function DonationPage() {
  const [donationInfo, setDonationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDonationInfo() {
      try {
        const response = await apiEndpoints.getDonationInfo();

        if (active) {
          setDonationInfo(response.data || null);
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDonationInfo();

    return () => {
      active = false;
    };
  }, []);

  const channels = Array.isArray(donationInfo?.channels) ? donationInfo.channels : [];

  if (loading) {
    return <LoadingSpinner label="Loading contribution info..." />;
  }

  return (
    <ResponsiveContainer>
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="min-w-0">
            <p className="break-words text-xs font-semibold uppercase leading-relaxed tracking-[0.08em] text-indigo-600 sm:tracking-[0.14em]">
              SUPPORT COMMUNITY | শিক্ষার্থী কমিউনিটিকে সহযোগিতা করুন
            </p>
            <h1 className="mt-3 max-w-4xl break-words text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Your contribution helps students prepare smarter
            </h1>
            <p className="mt-3 max-w-4xl break-words text-2xl font-semibold leading-9 text-slate-900">
              আপনার সহযোগিতা শিক্ষার্থীদের ভালো প্রস্তুতিতে সাহায্য করে
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="#contribute" size="lg" className="w-full sm:w-auto">
                Contribute Now | এখনই সহযোগিতা করুন
              </Button>
            </div>
            <p className="mt-5 break-words text-base font-semibold text-slate-700">
              Every contribution matters.
            </p>
            <p className="mt-1 break-words text-base font-semibold leading-7 text-slate-500">
              প্রতিটি সহযোগিতাই গুরুত্বপূর্ণ।
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Server & hosting", "সার্ভার ও হোস্টিং"],
              ["Database maintenance", "ডাটাবেজ রক্ষণাবেক্ষণ"],
              ["Question organization", "প্রশ্ন সংগঠিত করা"],
              ["Platform improvements", "প্ল্যাটফর্ম উন্নয়ন"],
            ].map(([english, bangla]) => (
              <div key={english} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="break-words text-sm font-semibold leading-6 text-slate-800">{english}</p>
                <p className="mt-2 break-words text-sm font-medium leading-7 text-slate-500">{bangla}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ErrorMessage>{error}</ErrorMessage>

      {channels.length === 0 ? (
        <EmptyState title="Contribution info is not available yet" description="Payment channels will appear when ready." />
      ) : (
        <section id="contribute" className="grid scroll-mt-24 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {channels.map((channel, index) => (
            <Card key={`${channel.type || "channel"}-${index}`} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{channel.type || "Channel"}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">{channel.label || "Contribution channel"}</h2>
                </div>
                {channel.instructions && <Badge tone="indigo">{channel.instructions}</Badge>}
              </div>

              <p className="break-words rounded-xl bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-950">
                {channel.number || "Number unavailable"}
              </p>
            </Card>
          ))}
        </section>
      )}

      {donationInfo?.note && <ErrorMessage tone="info">{donationInfo.note}</ErrorMessage>}
    </ResponsiveContainer>
  );
}

export default DonationPage;
