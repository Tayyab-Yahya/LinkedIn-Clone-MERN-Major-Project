import React, { useContext, useState, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import BlankProfile from "../assets/BlankProfile.png";
import { FiPlus, FiCamera } from "react-icons/fi";
import axios from "axios";

function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);

  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [username, setUsername] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });
  let [saving, setSaving] = useState(false);

  let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || BlankProfile)
  let [backendProfileImage, setBackendProfileImage] = useState(null)
  let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null)
  let [backendCoverImage, setBackendCoverImage] = useState(null)

  const profileImage = useRef();
  const coverImage = useRef();

  function addSkill(e) {
    e.preventDefault();
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
      setNewSkills("");
    }
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  function addEducation(e) {
    e.preventDefault();
    if (
      newEducation.college &&
      newEducation.degree &&
      newEducation.fieldOfStudy
    ) {
      setEducation([...education, newEducation]);
      setNewEducation({
        college: "",
        degree: "",
        fieldOfStudy: "",
      });
    }
  }

  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu));
    }
  }

  function addExperience(e) {
    e.preventDefault();
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description
    ) {
      setExperience([...experience, newExperience]);
      setNewExperience({
        title: "",
        company: "",
        description: "",
      });
    }
  }

  function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp));
    }
  }

  function handleProfileImage(e) {
    let file = e.target.files[0];
    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  }

  function handleCoverImage(e) {
    let file = e.target.files[0];
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      let formdata = new FormData()
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", username);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("gender", gender);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));

      if(backendProfileImage){
        formdata.append("profileImage", backendProfileImage);
      }
      if(backendCoverImage){
        formdata.append("coverImage", backendCoverImage);
      }

      let result = await axios.put(serverUrl+"/api/user/updateprofile", formdata, {withCredentials: true})
      setUserData(result.data);
      setSaving(false);
      setEdit(false);
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="fixed w-full h-[100vh] top-0  z-[100] flex justify-center items-center left-0">
      <input type="file" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept="image/*" hidden ref={coverImage} onChange={handleCoverImage}/>

      <div className="bg-black opacity-[0.5] w-full h-full absolute top-0 left-0"></div>

      <div className="w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] rounded-lg p-[10px] shadow-lg overflow-auto">
        <div
          className="absolute top-[15px] right-[15px] cursor-pointer"
          onClick={() => setEdit(false)}
        >
          <RxCross1 className="h-[20px] w-[20px] text-gray-800 font-bold" />
        </div>

        <div
          className="w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden cursor-pointer"
          onClick={() => coverImage.current.click()}
        >
          <img src={frontendCoverImage} alt="" className="flex justify-center items-center" />
          <FiCamera className="absolute top-[59px] right-[20px] text-white h-[20px] w-[20px]" />
        </div>

        <div
          className="text-gray-600 cursor-pointer absolute top-[165px] left-[40px] rounded-full border-2 border-white flex justify-center items-center"
          onClick={() => profileImage.current.click()} 
        >
          <img
            src={frontendProfileImage}
            alt="Profile"
            className="w-[70px] h-[70px] overflow-hidden rounded-full"
          />
        </div>
        {/* Plus Icon */}
        <div className="bg-blue-700 w-[20px] h-[20px] absolute top-[213px] left-[93px] rounded-full flex justify-center items-center text-white cursor-pointer">
          <FiPlus />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[60px]">
          <input
            type="text"
            placeholder="First Name"
            className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-full"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-full"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Headline"
            className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-full"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Gender (Male/Female/Other)"
            className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          {/* Skills */}
          <div className="w-full p-[10px] border-0 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold">Skills</h1>
            {skills && (
              <div className="w-full flex flex-row flex-wrap gap-[10px]">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-600 text-white py-[7px] px-[10px] rounded-full flex flex-row justify-between items-center gap-[10px]"
                  >
                    <span className="pl-[10px]">{skill}</span>
                    <RxCross1
                      className="h-[15px] w-[15px] text-white font-extrabold cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-end">
              <input
                type="text"
                placeholder="add new skill"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-full"
              />
              <button
                className="w-[50%] h-[40px] bg-blue-500 text-white py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500"
                onClick={addSkill}
              >
                Add skill
              </button>
            </div>
          </div>

          {/* Education */}
          <div className="w-full p-[10px] border-0 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold">Education</h1>
            {education && (
              <div className="w-full flex flex-row flex-wrap gap-[10px]">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 text-black py-[7px] px-[10px] rounded-lg flex flex-row justify-between items-start gap-[10px] border-2 border-gray-600 w-full"
                  >
                    <div>
                      <div>College: {edu.college}</div>
                      <div>Degree: {edu.degree}</div>
                      <div>Field of Study: {edu.fieldOfStudy}</div>
                    </div>
                    <RxCross1
                      onClick={() => removeEducation(edu)}
                      className="h-[15px] w-[15px] text-black font-extrabold cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-end">
              <input
                type="text"
                placeholder="college"
                value={newEducation.college}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, college: e.target.value })
                }
                className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-full"
              />

              <input
                type="text"
                placeholder="degree"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
                className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-full"
              />

              <input
                type="text"
                placeholder="field of study"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
                className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-full"
              />

              <button
                className="w-[50%] h-[40px] bg-blue-500 text-white py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500"
                onClick={addEducation}
              >
                Add education
              </button>
            </div>
          </div>

          {/* Experience */}
          <div className="w-full p-[10px] border-0 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold">Experience</h1>
            {experience && (
              <div className="w-full flex flex-row flex-wrap gap-[10px]">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 text-black py-[7px] px-[10px] rounded-lg flex flex-row justify-between items-start gap-[10px] border-2 border-gray-600 w-full"
                  >
                    <div>
                      <div>Title: {exp.title}</div>
                      <div>Company: {exp.company}</div>
                      <div>Description: {exp.description}</div>
                    </div>
                    <RxCross1
                      onClick={() => removeExperience(exp)}
                      className="h-[15px] w-[15px] text-black font-extrabold cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-end justify-center">
              <input
                type="text"
                placeholder="title"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-full"
              />

              <input
                type="text"
                placeholder="company"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-full"
              />

              <input
                type="text"
                placeholder="description"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                className="w-[100%] h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-full"
              />

              <button
                className="w-[50%] h-[40px] bg-blue-500 text-white py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500"
                onClick={addExperience}
              >
                Add experience
              </button>
            </div>
          </div>

          <button className="w-[100%] h-[40px] bg-white hover:text-white text-blue-800 py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500 my-[20px] flex items-center justify-center gap-[10px]" onClick={()=>handleSaveProfile()} disabled={saving}>
            {saving? "Saving..." : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
