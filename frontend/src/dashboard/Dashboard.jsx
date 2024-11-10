import { Navbar, NavbarBrand, Image, NavbarContent, NavbarItem, Link, Button, Input, Checkbox } from "@nextui-org/react";
import DansLogo from "../assets/images/logoDans.png";
import "../dashboard/style.css";
import { SearchIcon } from "./SearchIcon";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  //dynamic job found
  const jobFound = "Job Found";
  //check box
  const [fullTimeOnly, setFullTimeOnly] = useState(false);
  //end checkbox
  //job search
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchListJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      if (!token) {
        navigate("/YouHadNoToken");
      }
      const response = await axios.get("http://localhost:3000/api/positions", { headers });

      if (response.status === 200) {
        setJobs(response.data.data || []);
        console.log(jobs);
      } else {
        alert("failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchListJobs();
    jobs;
  }, []);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // Build query parameters based on the filled fields
      const params = {};
      if (description) params.description = description;
      if (location) params.location = location;
      if (fullTimeOnly) params.full_time = fullTimeOnly;

      const response = await axios.get("http://localhost:3000/api/jobs", { params, headers });
      if (response.status === 200) {
        setJobs(response.data.data || []);
        console.log(jobs);
      } else {
        alert("failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const pagination = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get("http://localhost:3000/api/jobs", { headers });
      if (response.status === 200) {
        setJobs(response.data.data || []);
        console.log(jobs);
      } else {
        alert("failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  //----------- end job search
  return (
    <>
      <Navbar position="static">
        <NavbarBrand className="gap-10">
          <Image src={DansLogo} className=" h-10 mt-1" />
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
          <NavbarItem className="hover:bg-red-500">
            <Link color="foreground" href="https://www.dansmultipro.com/contact/">
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {/* end navbar -------------------------------- */}

      <div className="job-search flex justify-evenly items-center mb-20 ">
        <div className="form-group flex flex-col items-center shadow-2xl gap-4">
          <label>Job Description</label>
          <Input className="rounded-2xl w-[300px]" variant="bordered" startContent={<SearchIcon size={18} />} type="text" placeholder="Search" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group flex flex-col items-center shadow-2xl gap-4">
          <label>Location</label>
          <Input className="rounded-2xl w-[300px]" variant="bordered" startContent={<SearchIcon size={18} />} type="text" placeholder="Search" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="form-group flex items-center">
          <Checkbox isSelected={fullTimeOnly} onChange={() => setFullTimeOnly(!fullTimeOnly)}>
            Full Time Only
          </Checkbox>
        </div>
        <Button onClick={handleSearch} color="warning" className="text-white">
          Search
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      <div className="h-auto flex justify-center items-center mt-10 ">
        <div className="h-[auto] w-[95%] rounded-xl shadow-2xl bg-gray-200 pt-7 flex flex-col gap-6 items-center border-2">
          <div className="w-52 rounded-xl flex justify-center h-14 items-center bg-blue-400">
            <span className="job-list-head text-xl font-semibold  text-white">Job List</span>
          </div>
          <span className="font-normal text-base">{jobs.length > 1 ? `Found ${jobs.length} Jobs Avaiable` : "Please wait while fetching job data"}</span>

          {jobs.map((job) => (
            <div className="rounded-2xl border-2 w-[90%] h-auto shadow-2xl flex justify-between items-center p-8 mb-4" key={job.id}>
              <div className="wrap">
                <div className="font-bold text-blue-500">{job.title}</div>
                <div>
                  {job.company} - <span className="text-green-700 font-medium">{job.type}</span>
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {job.location}
                </div>
                <div>
                  <span className="font-semibold">Posted at:</span> {job.created_at}
                </div>
              </div>
              <div className="button">
                <Link href={`/dashboard/job-details/${job.id}`}>
                  <Button color="warning" className="text-white">
                    Detail
                  </Button>
                </Link>
              </div>
            </div>
          ))}
          <Button onClick={pagination} className="mb-5 w-[60%] text-white font-semibold" color="primary">
            Load More Job!!
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
