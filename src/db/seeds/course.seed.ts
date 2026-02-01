import { CourseModel } from "../models/course.model";

/**
 * Course Seed Data
 * 20 sample courses for testing
 */
export const courseSeeds = [
	{
		title: "Introduction to Web Development",
		overview:
			"Learn the fundamentals of web development including HTML, CSS, and JavaScript. This course covers the basics of building modern websites from scratch.",
		resources: "https://developer.mozilla.org/en-US/docs/Web",
		image: "",
		categories: ["Web Development", "Programming"],
		rating: 4.5,
		minute: 1200,
		price: 49.99,
		level: "beginner",
		isActive: true,
	},
	{
		title: "Advanced React Development",
		overview:
			"Master React.js with advanced concepts like hooks, context, Redux, and performance optimization. Build production-ready applications.",
		resources: "https://react.dev",
		image: "",
		categories: ["Web Development", "React", "JavaScript"],
		rating: 4.8,
		minute: 1800,
		price: 79.99,
		level: "advanced",
		isActive: true,
	},
	{
		title: "Python for Data Science",
		overview:
			"Explore data science with Python. Learn pandas, numpy, matplotlib, and scikit-learn to analyze and visualize data effectively.",
		resources: "https://docs.python.org/3/",
		image: "",
		categories: ["Data Science", "Python", "Machine Learning"],
		rating: 4.7,
		minute: 2400,
		price: 89.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "Node.js Backend Mastery",
		overview:
			"Build scalable backend applications with Node.js, Express, and MongoDB. Learn REST APIs, authentication, and deployment strategies.",
		resources: "https://nodejs.org/docs/",
		image: "",
		categories: ["Backend Development", "Node.js", "JavaScript"],
		rating: 4.6,
		minute: 2000,
		price: 69.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "Mobile App Development with Flutter",
		overview:
			"Create beautiful cross-platform mobile applications using Flutter and Dart. Learn widgets, state management, and Firebase integration.",
		resources: "https://flutter.dev/docs",
		image: "",
		categories: ["Mobile Development", "Flutter", "Dart"],
		rating: 4.4,
		minute: 1600,
		price: 59.99,
		level: "beginner",
		isActive: true,
	},
	{
		title: "Machine Learning Fundamentals",
		overview:
			"Understand the core concepts of machine learning. Learn supervised and unsupervised learning, neural networks, and model evaluation.",
		resources: "https://scikit-learn.org/stable/",
		image: "",
		categories: ["Machine Learning", "AI", "Data Science"],
		rating: 4.9,
		minute: 3000,
		price: 129.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "Docker and Kubernetes for DevOps",
		overview:
			"Master containerization and orchestration with Docker and Kubernetes. Deploy and manage applications at scale in production environments.",
		resources: "https://kubernetes.io/docs/",
		image: "",
		categories: ["DevOps", "Docker", "Kubernetes"],
		rating: 4.5,
		minute: 1400,
		price: 74.99,
		level: "advanced",
		isActive: true,
	},
	{
		title: "SQL Database Mastery",
		overview:
			"Become proficient in SQL databases. Learn query optimization, database design, stored procedures, and transaction management.",
		resources: "https://www.postgresql.org/docs/",
		image: "",
		categories: ["Database", "SQL", "Backend Development"],
		rating: 4.3,
		minute: 1100,
		price: 44.99,
		level: "beginner",
		isActive: true,
	},
	{
		title: "TypeScript Complete Guide",
		overview:
			"Master TypeScript from basics to advanced features. Learn type safety, generics, decorators, and integration with popular frameworks.",
		resources: "https://www.typescriptlang.org/docs/",
		image: "",
		categories: ["Programming", "TypeScript", "JavaScript"],
		rating: 4.7,
		minute: 1300,
		price: 54.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "AWS Cloud Practitioner",
		overview:
			"Get started with Amazon Web Services. Learn core AWS services, cloud computing concepts, and prepare for the AWS certification exam.",
		resources: "https://aws.amazon.com/documentation/",
		image: "",
		categories: ["Cloud Computing", "AWS", "DevOps"],
		rating: 4.6,
		minute: 1500,
		price: 64.99,
		level: "beginner",
		isActive: true,
	},
	{
		title: "Vue.js 3 Complete Course",
		overview:
			"Learn Vue.js 3 from scratch. Master the Composition API, Vuex, Vue Router, and build modern single-page applications.",
		resources: "https://vuejs.org/guide/",
		image: "",
		categories: ["Web Development", "Vue.js", "JavaScript"],
		rating: 4.5,
		minute: 1400,
		price: 59.99,
		level: "beginner",
		isActive: true,
	},
	{
		title: "GraphQL API Development",
		overview:
			"Build powerful APIs with GraphQL. Learn schema design, resolvers, subscriptions, and integration with Apollo Client and Server.",
		resources: "https://graphql.org/learn/",
		image: "",
		categories: ["Backend Development", "GraphQL", "API"],
		rating: 4.4,
		minute: 1200,
		price: 69.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "Cybersecurity Essentials",
		overview:
			"Understand the fundamentals of cybersecurity. Learn about threats, vulnerabilities, security protocols, and ethical hacking basics.",
		resources: "https://www.owasp.org/",
		image: "",
		categories: ["Cybersecurity", "Security", "Networking"],
		rating: 4.8,
		minute: 2200,
		price: 99.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "UI/UX Design Principles",
		overview:
			"Master user interface and user experience design. Learn design thinking, wireframing, prototyping, and usability testing.",
		resources: "https://www.nngroup.com/articles/",
		image: "",
		categories: ["Design", "UI/UX", "Product Design"],
		rating: 4.6,
		minute: 1000,
		price: 49.99,
		level: "beginner",
		isActive: true,
	},
	{
		title: "Java Spring Boot Masterclass",
		overview:
			"Build enterprise-grade applications with Spring Boot. Learn dependency injection, REST APIs, JPA, security, and microservices architecture.",
		resources: "https://spring.io/guides",
		image: "",
		categories: ["Backend Development", "Java", "Spring Boot"],
		rating: 4.5,
		minute: 2600,
		price: 84.99,
		level: "advanced",
		isActive: true,
	},
	{
		title: "Git and GitHub Complete Guide",
		overview:
			"Master version control with Git and GitHub. Learn branching strategies, pull requests, code reviews, and collaborative workflows.",
		resources: "https://git-scm.com/doc",
		image: "",
		categories: ["DevOps", "Git", "Version Control"],
		rating: 4.7,
		minute: 600,
		price: 29.99,
		level: "beginner",
		isActive: true,
	},
	{
		title: "Deep Learning with TensorFlow",
		overview:
			"Dive deep into neural networks with TensorFlow. Build CNNs, RNNs, and transformers for image recognition and NLP tasks.",
		resources: "https://www.tensorflow.org/learn",
		image: "",
		categories: ["Machine Learning", "Deep Learning", "AI"],
		rating: 4.9,
		minute: 3600,
		price: 149.99,
		level: "advanced",
		isActive: true,
	},
	{
		title: "Angular Framework Complete Course",
		overview:
			"Master Angular framework from basics to advanced. Learn components, services, routing, forms, and state management with NgRx.",
		resources: "https://angular.io/docs",
		image: "",
		categories: ["Web Development", "Angular", "TypeScript"],
		rating: 4.4,
		minute: 1800,
		price: 69.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "Linux System Administration",
		overview:
			"Become proficient in Linux administration. Learn shell scripting, system management, networking, and server configuration.",
		resources: "https://www.kernel.org/doc/",
		image: "",
		categories: ["System Administration", "Linux", "DevOps"],
		rating: 4.6,
		minute: 1700,
		price: 59.99,
		level: "intermediate",
		isActive: true,
	},
	{
		title: "Blockchain Development Fundamentals",
		overview:
			"Explore blockchain technology and smart contracts. Learn Solidity, Ethereum development, and build decentralized applications.",
		resources: "https://ethereum.org/en/developers/docs/",
		image: "",
		categories: ["Blockchain", "Web3", "Cryptocurrency"],
		rating: 4.3,
		minute: 2000,
		price: 99.99,
		level: "advanced",
		isActive: true,
	},
];

/**
 * Seed Courses
 * Inserts sample course data into the database
 */
export const seedCourses = async () => {
	console.log("Seeding courses...");

	// Clear existing courses
	await CourseModel.deleteMany({});

	// Insert courses
	const courses = await CourseModel.insertMany(courseSeeds);
	console.log(`✓ Created ${courses.length} courses`);

	return courses;
};
