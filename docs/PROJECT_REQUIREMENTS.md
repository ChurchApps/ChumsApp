# CHUMS - Church Management Software

## Project Requirements Document

### 1. Executive Summary

CHUMS (CHUrch Management Software) is a comprehensive web-based church management platform designed to help churches efficiently manage their members, track attendance, handle donations, organize groups, plan services, and automate administrative tasks. The system provides a centralized solution for church administration with role-based access control and multi-church support.

### 2. System Overview

#### 2.1 Purpose

CHUMS serves as an all-in-one church management solution that digitizes and streamlines church operations, replacing manual processes with an integrated digital platform. It's designed to be a free and open-source alternative to other platforms of it's type.

#### 2.2 Scope

The system covers the following major functional areas:

- Member, visitor and management
- Attendance tracking
- Donation and financial management
- Group organization and volunteer scheduling
- Service planning and song library
- Task management and automation
- Reporting and analytics
- Multi-church support

#### 2.3 Related Apps

The system allows for the configuration of companion apps including:

- B1 Website (church directory, church website builder, online commnity)
- B1 Mobile App (mobile version of B1 website)
- Chums Checkin (mobile app to allow for self-checkin at churches)
- Chums Transfer (import/export tool for chums)

### 3. Functional Requirements

#### 3.1 User Authentication & Authorization

##### 3.1.1 Authentication

- Email/password-based login
- OAuth integration support
- JWT-based session management
- "Remember me" functionality via cookies
- Password reset capability
- Automatic redirect to originally requested URL after login

##### 3.1.2 Multi-Church Support

- Single user account can access multiple churches
- Church selection dialog after login
- Church-specific data isolation
- Ability to switch between churches

##### 3.1.3 Role-Based Access Control

- Customizable roles per church
- Granular permissions system
- Role assignment to users
- Permission inheritance

#### 3.2 People Management

##### 3.2.1 Member Records

- Comprehensive member profiles with:
  - Personal information (name, birthdate, gender, marital status)
  - Contact details (email, phone, address)
  - Photo upload capability
  - Membership date tracking
  - Custom notes field
- Member status tracking (member, visitor, staff)
- Household grouping and relationships
- Member directory visibility controls

##### 3.2.2 Search & Filtering

- Quick search by name
- Advanced search with multiple criteria
- Recent people view
- Export capabilities
- Bulk operations support

##### 3.2.3 Household Management

- Create and manage household units
- Define household roles (head, spouse, child, other)
- Link members within households
- Household address management

#### 3.3 Attendance Tracking

##### 3.3.1 Campus & Service Configuration

- Multiple campus support
- Service time definitions
- Service type categorization
- Attendance goals setting

##### 3.3.2 Check-In System Configuration

- Configuration to print name tags/labels

##### 3.3.3 Attendance Reporting

- Real-time attendance counts
- Historical attendance trends
- Service-by-service comparison
- Export attendance data

#### 3.4 Group Management

##### 3.4.1 Group Organization

- Create unlimited groups
- Group categories (small groups, ministries, classes)
- Group leadership assignment
- Meeting location and schedule

##### 3.4.2 Group Membership

- Add/remove members
- Track attendance per group
- Member communication tools
- Group directory

##### 3.4.3 Group Sessions

- Schedule group meetings/sessions
- Track session attendance

#### 3.5 Donation Management

##### 3.5.1 Fund Management

- Create and manage multiple funds

##### 3.5.2 Donation Recording

- Record individual donations
- Batch entry for multiple donations
- Multiple payment methods (cash, check, online)
- Recurring donation support
- Anonymous donation handling

##### 3.5.3 Financial Reporting

- Donor contribution statements
- Date range filtering
- Export to accounting software
- Tax receipt generation

#### 3.6 Service Planning

##### 3.6.1 Service Plans

- Create service plans/orders
- Drag-and-drop service elements
- Time management for service flow
- Multi-service support

##### 3.6.2 Ministry Teams

- Define ministry positions
- Assign team members to positions
- Schedule volunteers
- Conflict checking

##### 3.6.3 Song Management

- Song database with lyrics
- Chord charts and arrangements
- Key tracking and transposition
- CCLI integration
- PraiseCharts integration
- Links to third party services (YouTube, Spotify, Apple Music)

#### 3.7 Forms & Workflows

##### 3.7.1 Custom Forms

- Form builder with multiple question types
- Required field validation
- Conditional logic
- Payment integration

##### 3.7.2 Form Submissions

- Online form submission
- Admin review and approval
- Email notifications
- Data export

#### 3.8 Task Management

##### 3.8.1 Task Creation

- Manual task creation
- Task assignment to individuals
- Due date tracking
- Task categories

##### 3.8.2 Automation

- Event-triggered automation
- Conditional task creation
- Multi-condition support

#### 3.9 Communication

##### 3.9.1 Internal Messaging

- Task-related communications
- System notifications

##### 3.9.2 Member Communication

- Email integration
- Bulk communication tools
- Communication history tracking

#### 3.10 Reporting & Analytics

##### 3.10.1 Standard Reports

- Attendance trends
- Giving analysis
- Member growth
- Group participation

##### 3.10.2 Custom Reports

- Report builder interface
- Data filtering and grouping
- Chart visualization
- Export options (PDF, Excel, CSV)

#### 3.11 Administration

##### 3.11.1 Church Settings

- Church profile management
- Logo and branding
- Address and contact info
- Service times configuration
- Integration settings

##### 3.11.2 User Management

- User account creation
- Role assignment
- Access revocation
- Activity logging

##### 3.11.3 Data Management

- Import/export tools
- Data backup

### 4. Non-Functional Requirements

#### 4.1 Performance

- Page load time < 3 seconds
- Support for 1000+ concurrent users
- Real-time updates for critical features
- Efficient handling of large datasets (10,000+ members)

#### 4.2 Security

- HTTPS encryption for all communications
- Secure password storage (bcrypt)

#### 4.3 Usability

- Responsive design for all screen sizes
- Intuitive navigation
- Keyboard navigation support
- Help documentation
- Multi-language support (12 languages)

#### 4.4 Reliability

- 99.9% uptime target
- Automated error reporting
- Graceful error handling
- Data validation at all entry points

#### 4.5 Scalability

- Cloud-based architecture
- Horizontal scaling capability
- Database optimization
- Caching strategies

#### 4.6 Compatibility

- Modern web browsers (Chrome, Firefox, Safari, Edge)
- Mobile device support (iOS, Android)

### 5. Technical Requirements

#### 5.1 Frontend

- React with TypeScript
- Material-UI component library
- React Router for navigation
- Context API for state management
- Progressive Web App capabilities

#### 5.2 Backend

- RESTful API architecture
- JWT authentication
- Multi-tenant database design
- Microservices architecture

#### 5.3 Infrastructure

- Cloud hosting (AWS)
- CDN for static assets
- Load balancing
- Auto-scaling groups
- Continuous deployment pipeline

### 6. Integration Requirements

#### 6.1 Third-Party Services

- Payment processors
- Email services
- SMS gateways
- PraiseCharts for sheet music and song licensing

#### 6.2 Data Exchange

- API endpoints for external systems
- Webhook support
- Standard data formats (JSON, CSV)
- Batch import/export capabilities
