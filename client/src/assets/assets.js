import logo from "./logo.svg";
import search_icon from "./search_icon.svg";
import company_icon from "./company_icon.svg";
import microsoft_logo from "./microsoft_logo.svg";
import walmart_logo from "./walmart_logo.svg";
import accenture_logo from "./accenture_logo.png";
import profile_img from "./profile_img.png";
import app_main_img from "./app_main_img.png";
import cross_icon from "./cross_icon.svg";
import location_icon from "./location_icon.svg";
import money_icon from "./money_icon.svg";
import suitcase_icon from "./suitcase_icon.svg";
import person_icon from "./person_icon.svg";
import upload_area from "./upload_area.svg";
import resume_selected from "./resume_selected.svg";
import resume_not_selected from "./resume_not_selected.svg";
import play_store from "./play_store.svg";
import app_store from "./app_store.svg";
import back_arrow_icon from "./back_arrow_icon.svg";
import left_arrow_icon from "./left_arrow_icon.svg";
import right_arrow_icon from "./right_arrow_icon.svg";
import facebook_icon from "./facebook_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import twitter_icon from "./twitter_icon.svg";
import home_icon from "./home_icon.svg";
import add_icon from "./add_icon.svg";
import profile_upload_icon from "./profile_upload_icon.svg";
import person_tick_icon from "./person_tick_icon.svg";
import resume_download_icon from "./resume_download_icon.svg";
import delete_icon from "./delete_icon.svg";
import email_icon from "./email_icon.svg";
import lock_icon from "./lock_icon.svg";
import samsung_logo from "./samsung_logo.png";
import adobe_logo from "./adobe_logo.png";
import amazon_logo from "./amazon_logo.png";
import logonew from "./logonew.png";
import cv from "./cv.jpg";

export const assets = {
  logo,
  search_icon,
  cross_icon,
  upload_area,
  company_icon,
  resume_not_selected,
  resume_selected,
  microsoft_logo,
  walmart_logo,
  accenture_logo,
  app_main_img,
  play_store,
  app_store,
  back_arrow_icon,
  left_arrow_icon,
  right_arrow_icon,
  location_icon,
  money_icon,
  suitcase_icon,
  person_icon,
  facebook_icon,
  instagram_icon,
  twitter_icon,
  home_icon,
  add_icon,
  person_tick_icon,
  resume_download_icon,
  profile_img,
  delete_icon,
  profile_upload_icon,
  email_icon,
  lock_icon,
  samsung_logo,
  adobe_logo,
  amazon_logo,
  logonew,
  cv,
};

export const JobCategories = [
  "Công nghệ thông tin",
  "Trí tuệ nhân tạo",
  "Thiết kế",
  "Lao động phổ thông",
  "Nhân sự/Hành chính",
  "Marketing",
  "Kinh tế",
  "Giáo dục",
  "Y tế & Sức khỏe",
  "Tài chính/Ngân hàng/Bảo hiểm",
  "Sản xuất",
  "Điện tử",
];
export const JobLocations = [
  "Hồ Chí Minh",
  "Hà Nội",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];
export const JobTypes = ["On-site", "Hybrid", "Remote"];
export const JobExperiences = [
  "Không yêu cầu",
  "Dưới 1 năm",
  "1 năm",
  "2 năm",
  "3 năm",
  "4 năm",
  "Trên 5 năm",
];
export const JobLevels = [
  "Thực tập",
  "Nhân viên",
  "Trưởng phòng",
  "Quản lý",
  "Phó giám đốc",
  "Giám đốc",
];

// Sample data for Manage Jobs Page
export const manageJobsData = [
  {
    _id: 1,
    title: "Full Stack Developer",
    date: 1729102298497,
    location: "Bangalore",
    applicants: 20,
  },
  {
    _id: 2,
    title: "Data Scientist",
    date: 1729102298497,
    location: "San Francisco",
    applicants: 15,
  },
  {
    _id: 3,
    title: "Marketing Manager",
    date: 1729102298497,
    location: "London",
    applicants: 2,
  },
  {
    _id: 4,
    title: "UI/UX Designer",
    date: 1729102298497,
    location: "Dubai",
    applicants: 25,
  },
];

// Sample data for Profile Page
export const jobsApplied = [
  {
    company: "Amazon",
    title: "Full Stack Developer",
    location: "Bangalore",
    date: "22 Aug, 2024",
    status: "Pending",
    logo: company_icon,
  },
  {
    company: "Meta",
    title: "Data Scientist",
    location: "San Francisco",
    date: "22 Aug, 2024",
    status: "Rejected",
    logo: company_icon,
  },
  {
    company: "Google",
    title: "Marketing Manager",
    location: "London",
    date: "25 Sep, 2024",
    status: "Accepted",
    logo: company_icon,
  },
  {
    company: "Qualcomm",
    title: "UI/UX Designer",
    location: "Dubai",
    date: "15 Oct, 2024",
    status: "Pending",
    logo: company_icon,
  },
  {
    company: "Microsoft",
    title: "Full Stack Developer",
    location: "Hyderabad",
    date: "25 Sep, 2024",
    status: "Accepted",
    logo: company_icon,
  },
];

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

export const viewApplicationsPageData = [
  {
    _id: 1,
    name: "Richard Sanford",
    jobTitle: "Full Stack Developer",
    location: "Bangalore",
    imgSrc: profile_img,
    date: oneWeekAgo.toISOString().split("T")[0], // YYYY-MM-DD
  },
  {
    _id: 2,
    name: "Enrique Murphy",
    jobTitle: "Data Scientist",
    location: "San Francisco",
    imgSrc: profile_img,
    date: oneWeekAgo.toISOString().split("T")[0],
  },
  {
    _id: 3,
    name: "Alison Powell",
    jobTitle: "Marketing Manager",
    location: "London",
    imgSrc: profile_img,
    date: oneWeekAgo.toISOString().split("T")[0],
  },
  {
    _id: 4,
    name: "Richard Sanford",
    jobTitle: "UI/UX Designer",
    location: "Dubai",
    imgSrc: profile_img,
    date: oneWeekAgo.toISOString().split("T")[0],
  },
  {
    _id: 5,
    name: "Enrique Murphy",
    jobTitle: "Full Stack Developer",
    location: "Hyderabad",
    imgSrc: profile_img,
    date: oneWeekAgo.toISOString().split("T")[0],
  },
  {
    _id: 6,
    name: "Alison Powell",
    jobTitle: "Data Scientist",
    location: "New Delhi",
    imgSrc: profile_img,
    date: oneWeekAgo.toISOString().split("T")[0],
  },
  {
    _id: 7,
    name: "Richard Sanford",
    jobTitle: "Marketing Manager",
    location: "Chennai",
    imgSrc: profile_img,
    date: oneWeekAgo.toISOString().split("T")[0],
  },
];

export const jobsData = [
  {
    _id: "1",
    title: "Full Stack Developer",
    location: "TP. Hồ Chí Minh",
    level: "Thực tập sinh",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty TNHH Công Nghệ Việt",
      email: "techviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 82,
    date: 1729681667114,
    type: "Full-time",
    category: "Programming",
  },
  {
    _id: "2",
    title: "Data Scientist",
    location: "Hà Nội",
    level: "Thực tập sinh",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Dữ Liệu Việt",
      email: "datalab@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 7,
    type: "Full-time",
    experience: "2 năm",
    date: 1729681667114,
    category: "Data Science",
  },
  {
    _id: "3",
    title: "UI/UX Designer",
    location: "TP. Hồ Chí Minh",
    level: "Beginner Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Thiết Kế Việt",
      email: "designviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 6,
    date: 1729681667114,
    category: "Designing",
  },
  {
    _id: "4",
    title: "DevOps Engineer",
    location: "Hà Nội",
    level: "Senior Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Mạng Việt",
      email: "devopsviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 5,
    date: 1729681667114,
    category: "Programming",
  },
  {
    _id: "5",
    title: "Software Engineer",
    location: "TP. Hồ Chí Minh",
    level: "Intermediate Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Mạng Việt",
      email: "softwareviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 9,
    date: 1729681667114,
    category: "Programming",
  },
  {
    _id: "6",
    title: "Network Engineer",
    location: "Hà Nội",
    level: "Senior Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Mạng Việt",
      email: "networkviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 7,
    date: 1729681667114,
    category: "Networking",
  },
  {
    _id: "7",
    title: "Project Manager",
    location: "TP. Hồ Chí Minh",
    level: "Senior Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "managementviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 6,
    date: 1729681667114,
    category: "Management",
  },
  {
    _id: "8",
    title: "Mobile App Developer",
    location: "Hà Nội",
    level: "Intermediate Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "appviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 11,
    date: 1729681667114,
    category: "Programming",
  },
  {
    _id: "9",
    title: "Cloud Architect",
    location: "TP Hồ Chí Minh",
    experience: "2 năm",
    level: "Senior Level",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "cloudviet@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 9,
    date: 1729681667114,
    category: "Programming",
  },
  {
    _id: "10",
    title: "Technical Writer",
    location: "Hà Nội",
    level: "Intermediate Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "techwriter@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 12,
    date: 1729681667114,
    category: "Marketing",
  },
  {
    _id: "11",
    title: "Technical Writer",
    location: "Hà Nội",
    level: "Intermediate Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "techwriter@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 12,
    date: 1729681667114,
    category: "Marketing",
  },
  {
    _id: "12",
    title: "Technical Writer",
    location: "Hà Nội",
    level: "Intermediate Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "techwriter@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 12,
    date: 1729681667114,
    category: "Marketing",
  },
  {
    _id: "13",
    title: "Technical Writer",
    location: "Hà Nội",
    level: "Intermediate Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "techwriter@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 12,
    date: 1729681667114,
    category: "Marketing",
  },
  {
    _id: "14",
    title: "Technical Writer",
    location: "Thành phố Hồ Chí Minh",
    level: "Intermediate Level",
    experience: "1 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "techwriter@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 12,
    date: 1729681667114,
    category: "Marketing",
  },
  {
    _id: "15",
    title: "Technical Writer",
    location: "Hà Nội",
    level: "Intermediate Level",
    experience: "2 năm",
    companyId: {
      _id: "670e4d25ca9fda8f1bf359b9",
      name: "Công ty Viết Kỹ Thuật Việt",
      email: "techwriter@demo.com",
      image: company_icon,
    },
    description: `
        <p>Trở thành người kiến tạo trải nghiệm số với vai trò UI/UX Designer! Bạn sẽ làm việc chặt chẽ với các nhóm sản phẩm để thiết kế giao diện trực quan, đảm bảo hành trình người dùng mượt mà và đầy cảm hứng. Sự sáng tạo và tinh tế của bạn sẽ góp phần tạo ra những thiết kế không chỉ đẹp mắt mà còn tối ưu hiệu năng và sự hài lòng của người dùng.</p> <h2><strong>Nhiệm vụ chính</strong></h2> <ol> <li>Tiến hành nghiên cứu người dùng và kiểm thử tính khả dụng để hiểu rõ hành vi và nhu cầu người dùng.</li> <li>Thiết kế wireframe, prototype và giao diện chi tiết, mô phỏng rõ ràng luồng trải nghiệm người dùng.</li> <li>Phối hợp chặt chẽ với nhóm phát triển để đảm bảo thiết kế được hiện thực hóa chính xác và hiệu quả.</li> <li>Cập nhật liên tục xu hướng thiết kế UI/UX và áp dụng các phương pháp thiết kế hiện đại.</li> <li>Thu thập phản hồi từ người dùng để cải tiến sản phẩm qua từng vòng lặp thiết kế.</li> </ol> <h2><strong>Kỹ năng yêu cầu</strong></h2> <ol> <li>Thành thạo các công cụ thiết kế như Figma, Adobe XD hoặc Sketch.</li> <li>Am hiểu sâu về nguyên lý thiết kế lấy người dùng làm trung tâm.</li> <li>Kiến thức cơ bản về HTML/CSS để làm việc hiệu quả cùng lập trình viên.</li> <li>Kỹ năng giao tiếp rõ ràng và tinh thần làm việc nhóm tốt.</li> <li>Tư duy sáng tạo và khả năng giải quyết vấn đề linh hoạt.</li> </ol>`,
    salary: 12,
    date: 1729681667114,
    category: "Marketing",
  },
];
