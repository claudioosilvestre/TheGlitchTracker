# The Glitch Tracker - Oracle Edition

**The Glitch Tracker** is a centralized management platform designed for monitoring, diagnosing, and resolving system anomalies. The application functions as a command center where operatives can report incidents, manage the lifecycle of each glitch, and access a specialized technical knowledge base to find immediate solutions. The project stands out for its visual versatility, allowing users to toggle between a Professional workspace and a Matrix themed aesthetic.

This project was developed as the final project of the 26-week Software Engineering & AI intensive program at Code for All_, consolidating advanced skills in full-stack architecture and system integration.

## Tech Stack
- **Backend:** Java 21, Spring Boot, Spring Data JPA, Hibernate, Rest APIs
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **AI Integration:** Spring AI + OpenAI (Chat & Embeddings) with RAG (Retrieval-Augmented Generation)
- **Databse:** PostgreSQL
- **Build Tool:** Maven

## Getting Started

### Prerequisites
*   Java JDK 21 installed.
*   Maven installed.
*   PostgreSQL (installed and running)
*   Node.js(optional)
*   An IDE (IntelliJ IDEA recommended) or a terminal with Java support.
*   OpenAI API Key (for AI features)

### How to Run
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Maria-Sousa-GH/Oracle.git
    ```
2.  **Configure Database:** 
    ```bash
    CREATE DATABASE theglitchtracker;
    ```
3.  **Configure application.properties:** 
    ```bash
    Update the following fields in src/main/resources/application.properties:
    
    - DATABASE
    spring.datasource.url=jdbc:postgresql://localhost:5432/theglitchtracker
    spring.datasource.username=your_username
    spring.datasource.password=your_password

    - OPENAI
    spring.ai.openai.api-key=your_openai_api_key
    ```
4.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
5.  **Open your browser and go to http://localhost:8080**
    ```bash
    Note: All database tables are created automatically on the first run (spring.jpa.hibernate.ddl-auto=update).
    ```


## Features
*   **Glitch Management:** Complete CRUD operations to create, view, update, and archive system glitches with status and priority control.
*   **Dual-Theme Interface:** Instant toggle between the Professional theme and the Matrix theme.
*   **Operative Management:** Management of operatives with profile information and avatar image upload support.
*   **Interactive Dashboard:** Centralized view with real-time glitch overview, filtering, and prioritization tools.
*   **Responsive Design:** Fully responsive interface optimized for both desktop and mobile devices.

## Technical Challenges (Key Learnings)
*   **Spring Boot Architecture:** Clean REST API with Controllers, Services, DTOs, and global exception handling.
*   **File Management:** Secure avatar upload and static resource handling.
*   **AI Optimization:** Prompt engineering and efficient backend-frontend AI integration.
*   **Frontend State Management:** Managing dynamic page rendering and navigation using vanilla JavaScript.
*   **Theme System:** Creating and maintaining two completely different visual themes while preserving the same functionality and structure.
*   **Responsive Design:** Ensuring usability across desktop and mobile devices.
*   **REST API Integration:** Connecting frontend operations with backend services through asynchronous requests.

## Future Improvements
- [ ] Authentication & authorization
- [ ] User login system
- [ ] Drag & drop Kanban cards
- [ ] Analytics dashboard
- [ ] Notifications system
- [ ] add more features with AI

## Authors
*   ** Cláudio Silvestre ** — [LinkedIn](https://www.linkedin.com/in/claudioosilvestre)
*   ** Francisco Almeida ** — [LinkedIn](https://www.linkedin.com/in/fdinisdealmeida)
*   ** Maria Sousa ** — [LinkedIn]()
