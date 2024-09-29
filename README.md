# SafePat
Short for safe patient because we value patient safety


[Patient Portal](https://safepatientportal-black.vercel.app/)


[Healthcare Provider Portal](https://safepatientportal.vercel.app/)

Inspiration:

Medication errors are one of the most common and preventable causes of patient injury and manifest in multiple forms. The most common of these errors occur during the ordering and prescribing of medications and the administering of medications. After interviewing medical professionals, we identified a lack of standardization of safety features across electronic prescription and medical record systems for care providers as well as patients. This, coupled with prevalent short staffing and lack of time for reviewing patient external medical history when writing prescriptions, increases risk of medication errors. We sought to fix that by designing an electronic medical record system that offers more robust checking of prescriptions with patient medical history as well as improved guidance for patients on using and tracking medications. 

What it does:

Our approach for developing our platform is twofold. On the patient side, our platform serves as a centralized hub for prescription-related information. Users can access a complete overview of their prescriptions from various doctors, input crucial details for their medical profile to better inform new doctors of previous medical history during visits, and review their full medical history. The system provides current prescription information along with detailed instructions for use, leveraging data from the openFDA Drug API. To augment patient understanding, we've integrated Perplexity AI to generate concise summaries of prescription instructions in conjunction with our FDA-leveraged instructions, making complex medical information more accessible to patients who lack medical insight. Additionally, the platform includes a robust notification system to remind patients when to take their medications and allows them to log their prescription adherence, promoting better medication management and compliance.

For healthcare providers, providers can easily add patients, prescribe medications, and update specific hospitalization visits or surgeries. One of the key features is our database that automatically checks for existing prescriptions within the same drug class, helping to prevent potentially harmful drug interactions or duplications. The system also facilitates better coordination among healthcare providers by automatically alerting patients to contact their primary care provider when new treatments are added such as hospitalizations and surgeries, ensuring that care team members are synchronized with the patient's treatment history.

How we built it:

We developed our web app UI using React. We leveraged Next.js for configuring aspects of our application such as app routing. Our relational database is powered by Supabase. Our web app is deployed on Vercel. We integrated the openFDA Drug API to query for comprehensive patient instructions and warnings. We integrated Perplexity API to use llama-3.1-sonar (check exact one) to handle chat completion for our generated prescription instruction summaries and we handled OAuth and user management using Clerk. 

Challenges we ran into:

One of the first hurdles we faced was a misalignment between our initial ideas and the insights gathered from stakeholder interviews. This forced us to pivot early in the development process, highlighting the importance of user-centered design in healthcare solutions. As we delved deeper into implementation, we found that many of our desired features required a more robust system foundation than initially anticipated. Consequently, we spent more time than expected debugging and implementing basic functionalities such as calendar views and form submissions. These challenges, while time-consuming, ultimately led to a more solid and reliable platform that we can iterate on. 

Accomplishments that we’re proud of:

Despite the obstacles, we're proud of several significant achievements. We successfully built a functioning full-stack application that goes beyond typical electronic prescription systems. By leveraging a patient's comprehensive medical history and checking for specific factors like previously prescribed medications within the same drug class, our platform offers enhanced safety checks. We've also improved the clarity of prescription instructions for patients and centralized medical history documentation across providers. This centralization ensures that crucial information is not overlooked or forgotten during patient care.

What we learned:

This project served as an intensive crash course in full-stack web development. With little combined hackathon experience between us, we were pushed to test our coding skills in a time-constrained environment. We also deepened our understanding of medication errors and patient safety factors. Additionally, interviewing medical industry stakeholders proved invaluable, informing our product design and improving our insights into real-world healthcare needs.

We also gained practical experience in dealing with free, open-source APIs, which often lack comprehensive documentation or maintenance. This challenge honed our problem-solving skills and adaptability. 

Perhaps most importantly, however, we learned to prioritize features effectively. Recognizing that a full-scale electronic medical records and prescription system couldn't be completed in 36 hours by a two-person team, we focused on developing our most valuable features to demonstrate proof of concept.

Next Steps:

We have a few major priorities in terms of next steps. One of our first priorities is creating our own database based on the openFDA API, as it would allow for faster querying and more tailored functionality. We aim to enhance our safety checks by incorporating more comprehensive medical history information, including family medical history. For example, we envision a system that also warns doctors when prescribing medications above certain thresholds for patients with previous history of liver or kidney problems. Another major priority is ensuring HIPAA compliance through improved data encryption. Additionally, we recognize the importance of continuous feedback and iteration in a safety-critical domain like healthcare. We plan to conduct user testing with care teams and patients and refine features based on their feedback.