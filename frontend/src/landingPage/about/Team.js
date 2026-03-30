import React from "react";

function Team(){
    return(
        <>
            {/*  SECTION – OUR TEAM  */}

            <div className="team-section">
            <h2>Meet Our Team</h2>
            <p className="team-subtext">
                A group of passionate students committed to making mental wellness accessible.
            </p>

            <div className="team-grid">

                <div className="team-card">

                {/* 👇 Uncomment this when you add real image */}
                
                <img 
                    src="/Images/VishwajeetImg.jpeg"
                    alt="Vishwajeet Singh" 
                    className="team-img"
                />
                {/* Temporary Avatar */}
                {/* <div className="avatar">👨‍💻</div> */}

                <h5>Vishwajeet Singh</h5>
                {/* <p>Frontend Developer</p> */}
                </div>


                <div className="team-card">

                {/* 
                <img 
                    src="/images/member2.jpg" 
                    alt="Team Member" 
                    className="team-img"
                />
                */}

                <div className="avatar">👩‍💻</div>

                <h5>Chatterjee Koushik</h5>
                {/* <p>Backend Developer</p> */}
                </div>


                <div className="team-card">

                {/*
                <img 
                    src="/images/member3.jpg" 
                    alt="Team Member" 
                    className="team-img"
                />
                */}

                {/* <div className="avatar">👨‍🎓</div> */}

                 <img 
                    src="/Images/AnujitPhoto.jpeg" 
                    alt="Anujit" 
                    className="team-img"
                />

                <h5>Anujit Upadhyay</h5>
                {/* <p>Research & Content</p> */}
                </div>

                  <div className="team-card">

                
                <img 
                    src="/Images/SandeepImage.jpeg" 
                    alt="Sandeep" 
                    className="team-img"
                />
                

                {/* <div className="avatar">👨‍🎓</div> */}

                <h5>Sandeep Chaudhary</h5>
                {/* <p>Research & Content</p> */}
                </div>

                  <div className="team-card">

                {/*
                <img 
                    src="/images/member3.jpg" 
                    alt="Team Member" 
                    className="team-img"
                />
                */}

                <div className="avatar">👨‍🎓</div>

                <h5>Raghav Deedwaniya</h5>
                {/* <p>Research & Content</p> */}
                </div>

            </div>
            </div>
        </>
    )
}

export default Team;