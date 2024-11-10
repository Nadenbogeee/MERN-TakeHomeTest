import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image } from "@nextui-org/react";
import DansLogo from "../assets/images/logoDans.png";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          //use useNagigate to back to login if no token
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`http://localhost:3000/api/positions/${id}`, { headers });

        if (response.status === 200 && response.data.status === "success") {
          setJob(response.data.data);
        } else {
          alert("Failed to fetch job details");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        if (error.response?.status === 401) {
          navigate("/login"); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar position="static">
        <NavbarBrand className="gap-10">
          <Image src={DansLogo} className="h-10 mt-1" />
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link href="#" aria-current="page">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://www.dansmultipro.com/about/">
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://www.dansmultipro.com/services/">
              Services
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://www.dansmultipro.com/works/">
              Works
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://www.dansmultipro.com/news/">
              News
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://www.dansmultipro.com/career/">
              Career
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://www.dansmultipro.com/contact/">
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="h-auto flex justify-center items-center mt-10">
        {loading ? (
          <div className="text-xl">Loading...</div>
        ) : job ? (
          <div className="h-auto w-[95%] rounded-xl shadow-2xl bg-gray-200 pt-7 flex flex-col gap-6 items-center border-2 pb-8">
            <div className="rounded-2xl border-2 w-[90%] h-auto shadow-2xl bg-white p-8">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-blue-500 mb-2">{job.title}</h1>
                  <p className="text-lg">
                    {job.company} - <span className="text-green-700 font-medium">{job.type}</span>
                  </p>
                </div>
                <Button color="warning" className="text-white" onClick={handleBack}>
                  Back to Jobs
                </Button>
              </div>

              {/* Company Info Section */}
              <div className="mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold mb-2">Company Info</h2>
                <p className="mb-2">
                  <span className="font-semibold">Location:</span> {job.location}
                </p>
                <p>
                  <span className="font-semibold">Company URL:</span>{" "}
                  {job.company_url ? (
                    <a href={job.company_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {job.company_url}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>

              {/* Description Section */}
              <div className="mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                <div dangerouslySetInnerHTML={{ __html: job.description }} className="prose max-w-none" />
              </div>

              {/* How to Apply Section */}
              <div className="mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold mb-2">How to Apply</h2>
                <div dangerouslySetInnerHTML={{ __html: job.how_to_apply }} className="prose max-w-none" />
              </div>

              {/* Posted Date */}
              <div className="text-sm text-gray-500">Posted: {new Date(job.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ) : (
          <div className="text-xl">Job not found</div>
        )}
      </div>
    </>
  );
};

export default JobDetails;
