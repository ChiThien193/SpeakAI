"use client";
import React, { useState } from "react";
import Image from 'next/image';
import { FaBell, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import Slider from "react-slick"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title'); // Tìm kiếm cơ bản

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gọi API để lấy kết quả tìm kiếm
    console.log(`Tìm kiếm: ${searchTerm} cho ${searchBy}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  
  return (
    <div className="container">
      {/* header */}
      <header className="header">
        <Image src="/books/logo.webp" alt="logo" width={250} height={50} />
        {/* Tìm kiếm */}
        <form onSubmit={handleSearch} className="search-bar">
          <select 
            value={searchBy} 
            onChange={(e) => setSearchBy(e.target.value)} 
            className="search-select"
          >
            <option value="title">Sách giáo khoa</option>
            <option value="author">Tiểu thuyết</option>
            <option value="genre">Truyện tranh</option>
            <option value="keyword">Văn phòng phẩm</option>
          </select>
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="search-input"
          />
          <button type="submit" className="search-btn">Tìm kiếm</button>
        </form>
        <div className="header-icons">
          <FaBell className="header-icon" />
          <FaShoppingCart className="header-icon" />
          <FaUserCircle className="header-icon" />
        </div>
      </header>

      {/*Banner lưu động */}
      <div className="carousel-container mb-8">
      <Slider {...settings}>
        <div className="slide">
          <Image
            src="/qc/qc1.jpg"
            alt="Banner 1"
            layout="intrinsic" 
            width={1200}
            height={400}
            className="rounded-lg"
          />
        </div>
        <div className="slide">
          <Image
            src="/qc/qc2.jpg"
            alt="Banner 2"
            layout="intrinsic" 
            width={1200}
            height={400}
            className="rounded-lg"
          />
        </div>
        <div className="slide">
          <Image
            src="/qc/qc3.jpg"
            alt="Banner 3"
            layout="intrinsic" 
            width={1200}
            height={400}
            className="rounded-lg"
          />
        </div>
      </Slider>
    </div>


      <h4>Tủ sách</h4>
      {/* Danh sách các sách */}
      <div className="book-list">
        <div className="book-item">
          <Image src="/books/sach1.jpg" alt="sách1" width={500} height={750} />
          <h3>25 Độ Âm</h3>
          <p>126.400 đ -20%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach2.jpg" alt="sách2 " width={500} height={750} />
          <h3>Sổ tay ngữ pháp tiếng anh</h3>
          <p>49.000 đ -30%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach3.jpg" alt="sách3" width={500} height={750} />
          <h3>Hiểu về trái tim</h3>
          <p>135.880 đ -14%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach4.jpg" alt="sách4" width={500} height={750} />
          <h3>Thám tử Conan</h3>
          <p>45.000 đ -10%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach5.jpg" alt="sách5" width={500} height={750} />
          <h3>Người đưa diều</h3>
          <p>103.200 đ -20%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach6.jpg" alt="sách6" width={500} height={750} />
          <h3>Ngày xưa có một chuyện tình</h3>
          <p>60.000 đ -20%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach7.jpg" alt="sách7" width={500} height={750} />
          <h3>Doraemon</h3>
          <p>54.000 đ -10%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach8.jpg" alt="sách8" width={500} height={750} />
          <h3>Cuốn sách xanh ở NEBO</h3>
          <p>71.250 đ -25%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach9.jpg" alt="sách9" width={500} height={750} />
          <h3>Sách giáo viên âm nhạc 1</h3>
          <p>8.000 đ -60%</p>
        </div>
        <div className="book-item">
          <Image src="/books/sach10.jpg" alt="sách10" width={500} height={750} />
          <h3>Chiến quốc sách</h3>
          <p>87.320 đ -26%</p>
        </div>
      </div>
      <h4>Văn phòng phẩm nổi bật</h4>
      <div className="Items-list">
        <div className="Item">
          <Image src="/items/item1.jpg" alt="dụng cụ 1" width={500} height={750} />
          <h3>Bảng tên nhựa dọc dây lụa màu xanh</h3>
          <p>46.610 đ -21%</p>
        </div>
        <div className="Item">
          <Image src="/items/item2.jpg" alt="dụng cụ 2" width={500} height={750} />
          <h3>Bảng tên nhựa dọc dây lụa màu tím</h3>
          <p>46.610 đ -21%</p>
        </div>
        <div className="Item">
          <Image src="/items/item3.jpg" alt="dụng cụ 3" width={500} height={750} />
          <h3>Dây đeo bảng tên kèm móc cài màu xanh</h3>
          <p>11.620 đ -17%</p>
        </div>
        <div className="Item">
          <Image src="/items/item4.jpg" alt="dụng cụ 4" width={500} height={750} />
          <h3>Dây đeo kèm móc cài kim loại màu trắng</h3>
          <p>11.620 đ -17%</p>
        </div>
        <div className="Item">
          <Image src="/items/item5.jpg" alt="dụng cụ 5" width={500} height={750} />
          <h3>Bảng tên dây kẹp sắt</h3>
          <p>5.200 đ -20%</p>
        </div>
        <div className="Item">
          <Image src="/items/item6.jpg" alt="dụng cụ 6" width={500} height={750} />
          <h3>Dây đeo bảng tên kèm móc cài màu đỏ</h3>
          <p>11.620 đ -17%</p>
        </div>
        <div className="Item">
          <Image src="/items/item7.jpg" alt="dụng cụ 7" width={500} height={750} />
          <h3>Dây đeo bảng tên màu vàng</h3>
          <p>3.900 đ -22%</p>
        </div>
        <div className="Item">
          <Image src="/items/item8.jpg" alt="dụng cụ 8" width={500} height={750} />
          <h3>Dây đeo kèm móc cài kim loại màu đỏ</h3>
          <p>11.620 đ -17%</p>
        </div>
        <div className="Item">
          <Image src="/items/item9.jpg" alt="dụng cụ 9" width={500} height={750} />
          <h3>Dây đeo bảng tên màu xanh</h3>
          <p>3.900 đ -22%</p>
        </div>
        <div className="Item">
          <Image src="/items/item10.jpg" alt="dụng cụ 10" width={500} height={750} />
          <h3>Bảng tên dây đeo</h3>
          <p>18.000 đ -25%</p>
        </div>
      </div>
      {/*footer*/}
      <footer className="footer">
        <div className="footer-container">
          {/* Cột thông tin địa chỉ */}
          <div className="footer-col">
            <Image src="/books/logo.webp" alt="logo" width={50} height={100} className="footer-logo" />
            <p>Lầu 5, 387-389 Hai Bà Trưng, Quận 3, TP HCM</p>
            <p>Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA</p>
            <p>60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</p>
            <p>
              Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận
              hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên toàn quốc.
            </p>
          </div>
          {/* Cột dịch vụ */}
          <div className="footer-col">
            <h4>DỊCH VỤ</h4>
            <ul>
              <li>Điều khoản sử dụng</li>
              <li>Chính sách bảo mật thông tin cá nhân</li>
              <li>Chính sách bảo mật thanh toán</li>
              <li>Giới thiệu Fahasa</li>
              <li>Hệ thống trung tâm - nhà sách</li>
            </ul>
          </div>
          {/* Cột hỗ trợ */}
          <div className="footer-col">
            <h4>HỖ TRỢ</h4>
            <ul>
              <li>Chính sách đổi - trả - hoàn tiền</li>
              <li>Chính sách bảo hành - bồi hoàn</li>
              <li>Chính sách vận chuyển</li>
              <li>Chính sách khách sỉ</li>
            </ul>
          </div>
          {/* Cột tài khoản */}
          <div className="footer-col">
            <h4>TÀI KHOẢN CỦA TÔI</h4>
            <ul>
              <li>Đăng nhập/ Tạo mới tài khoản</li>
              <li>Thay đổi địa chỉ khách hàng</li>
              <li>Chi tiết tài khoản</li>
              <li>Lịch sử mua hàng</li>
            </ul>
          </div>
          {/* Cột liên hệ */}
          <div className="footer-col">
            <h4>LIÊN HỆ</h4>
            <p>60-62 Lê Lợi, Q.1, TP. HCM</p>
            <p>Email: cskh@fahasa.com.vn</p>
            <p>Hotline: 1900636467</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
