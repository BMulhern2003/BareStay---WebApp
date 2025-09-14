'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'th' | 'id'
export type Currency = 'GBP' | 'THB' | 'IDR'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  t: (key: string) => string
  formatPrice: (price: number) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Currency configurations
const currencyConfig = {
  GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' },
  THB: { symbol: '฿', code: 'THB', locale: 'th-TH' },
  IDR: { symbol: 'Rp', code: 'IDR', locale: 'id-ID' }
}

// Translation mappings
const translations = {
  en: {
    // Navigation
    'nav.hotels': 'Hotels',
    'nav.properties': 'Properties',
    'nav.become_provider': 'Become a Provider',
    'nav.sign_in': 'Sign in',
    'nav.sign_up': 'Sign up',
    'nav.host_home': 'Host your home',
    'nav.host_experience': 'Host an experience',
    'nav.help': 'Help',
    'nav.sign_out': 'Sign Out',
    'nav.my_bookings': 'My Bookings',
    'nav.profile': 'Profile',
    
    // Language names
    'lang.english': 'English',
    'lang.thai': 'ไทย',
    'lang.indonesian': 'Bahasa Indonesia',
    
    // Currency names
    'currency.gbp': 'British Pound',
    'currency.thb': 'Thai Baht',
    'currency.idr': 'Indonesian Rupiah',
    
    // Footer
    'footer.tagline': 'Premium stays and experiences, thoughtfully curated for your next adventure.',
    'footer.support': 'Support',
    'footer.help_center': 'Help Center',
    'footer.safety_info': 'Safety Information',
    'footer.cancellation_options': 'Cancellation Options',
    'footer.accessibility': 'Accessibility',
    'footer.community': 'Community',
    'footer.become_provider': 'Become a Provider',
    'footer.host_experience': 'Host an Experience',
    'footer.refer_friend': 'Refer a Friend',
    'footer.community_guidelines': 'Community Guidelines',
    'footer.company': 'Company',
    'footer.about_us': 'About Us',
    'footer.careers': 'Careers',
    'footer.press': 'Press',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2024 BareStay, Inc.',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.terms_of_service': 'Terms of Service',
    'footer.cookie_policy': 'Cookie Policy',
    'footer.follow_us': 'Follow us:',
    
    // Hotels page
    'hotels.where': 'Where',
    'hotels.search_destinations': 'Search destinations',
    'hotels.check_in': 'Check in',
    'hotels.check_out': 'Check out',
    'hotels.add_dates': 'Add dates',
    'hotels.who': 'Who',
    'hotels.add_guests': 'Add guests',
    'hotels.guests': 'guests',
    'hotels.guest': 'guest',
    'hotels.search': 'Search',
    'hotels.suggested_destinations': 'Suggested destinations',
    'hotels.adults': 'Adults',
    'hotels.children': 'Children',
    'hotels.ages_13_above': 'Ages 13 or above',
    'hotels.ages_2_12': 'Ages 2-12',
    'hotels.loading_hotels': 'Loading hotels...',
    'hotels.no_hotels_found': 'No hotels match your search criteria.',
    'hotels.search_using_form': 'Search for hotels using the form above.',
    'hotels.available': 'hotels available',
    'hotels.per_night': 'night',
    'hotels.night': 'night',
    'hotels.nights': 'nights',
    'hotels.from': 'from',
    'hotels.view_details': 'View Details',
    'hotels.book_now': 'Book',
    'hotels.book': 'Book',
    'hotels.booking': 'Booking...',
    'hotels.rating': 'Rating',
    'hotels.reviews': 'reviews',
    'hotels.free_cancellation': 'Free cancellation',
    'hotels.breakfast_included': 'Breakfast included',
    'hotels.wifi_included': 'WiFi included',
    'hotels.pool': 'Pool',
    'hotels.gym': 'Gym',
    'hotels.spa': 'Spa',
    'hotels.restaurant': 'Restaurant',
    'hotels.parking': 'Parking',
    'hotels.airport_shuttle': 'Airport shuttle',
    'hotels.pet_friendly': 'Pet friendly',
    'hotels.business_center': 'Business center',
    'hotels.concierge': 'Concierge',
    'hotels.room_service': 'Room service',
    'hotels.laundry': 'Laundry service',
    'hotels.currency_selector': 'Currency',
    'hotels.amenities': 'Amenities',
    'hotels.no_rooms': 'No rooms',
    'hotels.sold_out': 'Sold Out',
    'hotels.available_rooms': 'rooms available',
    'hotels.hotel_not_found': 'Hotel not found',
    'hotels.back_to_hotels': 'Back to Hotels',
    'hotels.select_dates': 'Select your dates',
    'hotels.select_date': 'Select date',
    'hotels.stay_summary': 'Stay Summary',
    'hotels.available_rooms_list': 'Available Rooms',
    'hotels.no_rooms_available': 'No rooms available',
    'hotels.total_cost': 'Total cost',
    'hotels.disclaimer_title': 'Important Information',
    'hotels.disclaimer_1': 'Prices shown are per night and may vary based on availability and season.',
    'hotels.disclaimer_2': 'Additional fees such as taxes, service charges, and resort fees may apply.',
    'hotels.disclaimer_3': 'Room availability is subject to confirmation at the time of booking.',
    'hotels.disclaimer_4': 'Please review all terms and conditions before completing your reservation.',
    
    // Room types
    'room.standard': 'Standard Room',
    'room.deluxe': 'Deluxe Room',
    'room.suite': 'Suite',
    'room.presidential': 'Presidential Suite',
    'room.family': 'Family Room',
    'room.business': 'Business Room',
    'room.accessible': 'Accessible Room',
    'room.smoking': 'Smoking Room',
    'room.non_smoking': 'Non-smoking Room',
    
    // Amenities
    'amenity.wifi': 'Free WiFi',
    'amenity.breakfast': 'Breakfast',
    'amenity.pool': 'Swimming Pool',
    'amenity.gym': 'Fitness Center',
    'amenity.spa': 'Spa & Wellness',
    'amenity.restaurant': 'Restaurant',
    'amenity.parking': 'Parking',
    'amenity.airport_shuttle': 'Airport Shuttle',
    'amenity.pet_friendly': 'Pet Friendly',
    'amenity.business_center': 'Business Center',
    'amenity.concierge': 'Concierge',
    'amenity.room_service': '24/7 Room Service',
    'amenity.laundry': 'Laundry Service',
    'amenity.ac': 'Air Conditioning',
    'amenity.tv': 'Flat-screen TV',
    'amenity.minibar': 'Minibar',
    'amenity.safe': 'In-room Safe',
    'amenity.balcony': 'Balcony',
    'amenity.ocean_view': 'Ocean View',
    'amenity.city_view': 'City View',
    'amenity.garden_view': 'Garden View',
    
    // Booking
    'booking.select_dates': 'Select dates',
    'booking.select_guests': 'Select guests',
    'booking.total_price': 'Total price',
    'booking.price_breakdown': 'Price breakdown',
    'booking.taxes_fees': 'Taxes and fees',
    'booking.service_fee': 'Service fee',
    'booking.cleaning_fee': 'Cleaning fee',
    'booking.security_deposit': 'Security deposit',
    'booking.confirm_booking': 'Confirm Booking',
    'booking.cancellation_policy': 'Cancellation policy',
    'booking.free_cancellation_until': 'Free cancellation until',
    'booking.non_refundable': 'Non-refundable',
    'booking.partial_refund': 'Partial refund available',
    
    // Room Match
    'room_match.title': 'Room Match',
    'room_match.no_more_properties': 'No more properties!',
    'room_match.seen_all': 'You\'ve seen all available properties.',
    'room_match.close': 'Close',
    'room_match.like': 'Like',
    'room_match.pass': 'Pass',
    'room_match.matches': 'Matches',
    'room_match.start_matching': 'Start Matching',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.or': 'or',
    'common.and': 'and',
  },
  th: {
    // Navigation
    'nav.hotels': 'โรงแรม',
    'nav.properties': 'อสังหาริมทรัพย์',
    'nav.become_provider': 'เป็นผู้ให้บริการ',
    'nav.sign_in': 'เข้าสู่ระบบ',
    'nav.sign_up': 'สมัครสมาชิก',
    'nav.host_home': 'ให้เช่าบ้านของคุณ',
    'nav.host_experience': 'จัดประสบการณ์',
    'nav.help': 'ช่วยเหลือ',
    'nav.sign_out': 'ออกจากระบบ',
    'nav.my_bookings': 'การจองของฉัน',
    'nav.profile': 'โปรไฟล์',
    
    // Language names
    'lang.english': 'English',
    'lang.thai': 'ไทย',
    'lang.indonesian': 'Bahasa Indonesia',
    
    // Currency names
    'currency.gbp': 'ปอนด์อังกฤษ',
    'currency.thb': 'บาทไทย',
    'currency.idr': 'รูเปียห์อินโดนีเซีย',
    
    // Footer
    'footer.tagline': 'ที่พักพรีเมียมและประสบการณ์ที่คัดสรรอย่างพิถีพิถันสำหรับการผจญภัยครั้งต่อไปของคุณ',
    'footer.support': 'การสนับสนุน',
    'footer.help_center': 'ศูนย์ช่วยเหลือ',
    'footer.safety_info': 'ข้อมูลความปลอดภัย',
    'footer.cancellation_options': 'ตัวเลือกการยกเลิก',
    'footer.accessibility': 'การเข้าถึง',
    'footer.community': 'ชุมชน',
    'footer.become_provider': 'เป็นผู้ให้บริการ',
    'footer.host_experience': 'จัดประสบการณ์',
    'footer.refer_friend': 'แนะนำเพื่อน',
    'footer.community_guidelines': 'แนวทางชุมชน',
    'footer.company': 'บริษัท',
    'footer.about_us': 'เกี่ยวกับเรา',
    'footer.careers': 'อาชีพ',
    'footer.press': 'สื่อมวลชน',
    'footer.contact': 'ติดต่อ',
    'footer.copyright': '© 2024 BareStay, Inc.',
    'footer.privacy_policy': 'นโยบายความเป็นส่วนตัว',
    'footer.terms_of_service': 'เงื่อนไขการให้บริการ',
    'footer.cookie_policy': 'นโยบายคุกกี้',
    'footer.follow_us': 'ติดตามเรา:',
    
    // Hotels page
    'hotels.where': 'ที่ไหน',
    'hotels.search_destinations': 'ค้นหาจุดหมาย',
    'hotels.check_in': 'เช็คอิน',
    'hotels.check_out': 'เช็คเอาท์',
    'hotels.add_dates': 'เพิ่มวันที่',
    'hotels.who': 'ใคร',
    'hotels.add_guests': 'เพิ่มแขก',
    'hotels.guests': 'แขก',
    'hotels.guest': 'แขก',
    'hotels.search': 'ค้นหา',
    'hotels.suggested_destinations': 'จุดหมายแนะนำ',
    'hotels.adults': 'ผู้ใหญ่',
    'hotels.children': 'เด็ก',
    'hotels.ages_13_above': 'อายุ 13 ปีขึ้นไป',
    'hotels.ages_2_12': 'อายุ 2-12 ปี',
    'hotels.loading_hotels': 'กำลังโหลดโรงแรม...',
    'hotels.no_hotels_found': 'ไม่พบโรงแรมที่ตรงกับเกณฑ์การค้นหาของคุณ',
    'hotels.search_using_form': 'ค้นหาโรงแรมโดยใช้แบบฟอร์มด้านบน',
    'hotels.available': 'โรงแรมพร้อมใช้งาน',
    'hotels.per_night': 'คืน',
    'hotels.night': 'คืน',
    'hotels.nights': 'คืน',
    'hotels.from': 'เริ่มต้น',
    'hotels.view_details': 'ดูรายละเอียด',
    'hotels.book_now': 'จอง',
    'hotels.book': 'จอง',
    'hotels.booking': 'กำลังจอง...',
    'hotels.rating': 'คะแนน',
    'hotels.reviews': 'รีวิว',
    'hotels.free_cancellation': 'ยกเลิกฟรี',
    'hotels.breakfast_included': 'รวมอาหารเช้า',
    'hotels.wifi_included': 'รวม WiFi',
    'hotels.pool': 'สระว่ายน้ำ',
    'hotels.gym': 'ฟิตเนส',
    'hotels.spa': 'สปา',
    'hotels.restaurant': 'ร้านอาหาร',
    'hotels.parking': 'ที่จอดรถ',
    'hotels.airport_shuttle': 'รถรับส่งสนามบิน',
    'hotels.pet_friendly': 'อนุญาตสัตว์เลี้ยง',
    'hotels.business_center': 'ศูนย์ธุรกิจ',
    'hotels.concierge': 'คอนเซียร์จ',
    'hotels.room_service': 'บริการห้องพัก',
    'hotels.laundry': 'บริการซักรีด',
    'hotels.currency_selector': 'สกุลเงิน',
    'hotels.amenities': 'สิ่งอำนวยความสะดวก',
    'hotels.no_rooms': 'ไม่มีห้อง',
    'hotels.sold_out': 'ขายหมด',
    'hotels.available_rooms': 'ห้องพร้อมใช้งาน',
    'hotels.hotel_not_found': 'ไม่พบโรงแรม',
    'hotels.back_to_hotels': 'กลับไปที่โรงแรม',
    'hotels.select_dates': 'เลือกวันที่ของคุณ',
    'hotels.select_date': 'เลือกวันที่',
    'hotels.stay_summary': 'สรุปการพัก',
    'hotels.available_rooms_list': 'ห้องพักที่พร้อมใช้งาน',
    'hotels.no_rooms_available': 'ไม่มีห้องพัก',
    'hotels.total_cost': 'ราคารวม',
    'hotels.disclaimer_title': 'ข้อมูลสำคัญ',
    'hotels.disclaimer_1': 'ราคาที่แสดงเป็นราคาต่อคืนและอาจแตกต่างกันตามความพร้อมใช้งานและฤดูกาล',
    'hotels.disclaimer_2': 'อาจมีค่าธรรมเนียมเพิ่มเติม เช่น ภาษี ค่าบริการ และค่าธรรมเนียมรีสอร์ท',
    'hotels.disclaimer_3': 'ความพร้อมใช้งานของห้องพักขึ้นอยู่กับการยืนยันในเวลาที่ทำการจอง',
    'hotels.disclaimer_4': 'กรุณาตรวจสอบข้อกำหนดและเงื่อนไขทั้งหมดก่อนทำการจอง',
    
    // Room types
    'room.standard': 'ห้องมาตรฐาน',
    'room.deluxe': 'ห้องดีลักซ์',
    'room.suite': 'ห้องสวีท',
    'room.presidential': 'ห้องประธานาธิบดี',
    'room.family': 'ห้องครอบครัว',
    'room.business': 'ห้องธุรกิจ',
    'room.accessible': 'ห้องสำหรับผู้พิการ',
    'room.smoking': 'ห้องสูบบุหรี่',
    'room.non_smoking': 'ห้องไม่สูบบุหรี่',
    
    // Amenities
    'amenity.wifi': 'WiFi ฟรี',
    'amenity.breakfast': 'อาหารเช้า',
    'amenity.pool': 'สระว่ายน้ำ',
    'amenity.gym': 'ศูนย์ฟิตเนส',
    'amenity.spa': 'สปาและสุขภาพ',
    'amenity.restaurant': 'ร้านอาหาร',
    'amenity.parking': 'ที่จอดรถ',
    'amenity.airport_shuttle': 'รถรับส่งสนามบิน',
    'amenity.pet_friendly': 'อนุญาตสัตว์เลี้ยง',
    'amenity.business_center': 'ศูนย์ธุรกิจ',
    'amenity.concierge': 'คอนเซียร์จ',
    'amenity.room_service': 'บริการห้องพัก 24 ชั่วโมง',
    'amenity.laundry': 'บริการซักรีด',
    'amenity.ac': 'เครื่องปรับอากาศ',
    'amenity.tv': 'ทีวีจอแบน',
    'amenity.minibar': 'มินิบาร์',
    'amenity.safe': 'ตู้นิรภัยในห้อง',
    'amenity.balcony': 'ระเบียง',
    'amenity.ocean_view': 'วิวมหาสมุทร',
    'amenity.city_view': 'วิวเมือง',
    'amenity.garden_view': 'วิวสวน',
    
    // Booking
    'booking.select_dates': 'เลือกวันที่',
    'booking.select_guests': 'เลือกแขก',
    'booking.total_price': 'ราคารวม',
    'booking.price_breakdown': 'รายละเอียดราคา',
    'booking.taxes_fees': 'ภาษีและค่าธรรมเนียม',
    'booking.service_fee': 'ค่าบริการ',
    'booking.cleaning_fee': 'ค่าทำความสะอาด',
    'booking.security_deposit': 'เงินมัดจำ',
    'booking.confirm_booking': 'ยืนยันการจอง',
    'booking.cancellation_policy': 'นโยบายการยกเลิก',
    'booking.free_cancellation_until': 'ยกเลิกฟรีจนถึง',
    'booking.non_refundable': 'ไม่สามารถคืนเงินได้',
    'booking.partial_refund': 'คืนเงินบางส่วนได้',
    
    // Room Match
    'room_match.title': 'จับคู่ห้อง',
    'room_match.no_more_properties': 'ไม่มีทรัพย์สินเพิ่มเติม!',
    'room_match.seen_all': 'คุณได้ดูทรัพย์สินที่มีอยู่ทั้งหมดแล้ว',
    'room_match.close': 'ปิด',
    'room_match.like': 'ชอบ',
    'room_match.pass': 'ผ่าน',
    'room_match.matches': 'การจับคู่',
    'room_match.start_matching': 'เริ่มจับคู่',
    
    // Common
    'common.loading': 'กำลังโหลด...',
    'common.error': 'ข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.cancel': 'ยกเลิก',
    'common.confirm': 'ยืนยัน',
    'common.save': 'บันทึก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.close': 'ปิด',
    'common.back': 'กลับ',
    'common.next': 'ถัดไป',
    'common.previous': 'ก่อนหน้า',
    'common.yes': 'ใช่',
    'common.no': 'ไม่',
    'common.or': 'หรือ',
    'common.and': 'และ',
  },
  id: {
    // Navigation
    'nav.hotels': 'Hotel',
    'nav.properties': 'Properti',
    'nav.become_provider': 'Jadi Penyedia',
    'nav.sign_in': 'Masuk',
    'nav.sign_up': 'Daftar',
    'nav.host_home': 'Hosting rumah Anda',
    'nav.host_experience': 'Hosting pengalaman',
    'nav.help': 'Bantuan',
    'nav.sign_out': 'Keluar',
    'nav.my_bookings': 'Pemesanan Saya',
    'nav.profile': 'Profil',
    
    // Language names
    'lang.english': 'English',
    'lang.thai': 'ไทย',
    'lang.indonesian': 'Bahasa Indonesia',
    
    // Currency names
    'currency.gbp': 'Pound Inggris',
    'currency.thb': 'Baht Thailand',
    'currency.idr': 'Rupiah Indonesia',
    
    // Footer
    'footer.tagline': 'Akomodasi premium dan pengalaman yang dipilih dengan cermat untuk petualangan Anda selanjutnya.',
    'footer.support': 'Dukungan',
    'footer.help_center': 'Pusat Bantuan',
    'footer.safety_info': 'Informasi Keamanan',
    'footer.cancellation_options': 'Opsi Pembatalan',
    'footer.accessibility': 'Aksesibilitas',
    'footer.community': 'Komunitas',
    'footer.become_provider': 'Jadi Penyedia',
    'footer.host_experience': 'Hosting Pengalaman',
    'footer.refer_friend': 'Rekomendasikan Teman',
    'footer.community_guidelines': 'Panduan Komunitas',
    'footer.company': 'Perusahaan',
    'footer.about_us': 'Tentang Kami',
    'footer.careers': 'Karir',
    'footer.press': 'Pers',
    'footer.contact': 'Kontak',
    'footer.copyright': '© 2024 BareStay, Inc.',
    'footer.privacy_policy': 'Kebijakan Privasi',
    'footer.terms_of_service': 'Syarat Layanan',
    'footer.cookie_policy': 'Kebijakan Cookie',
    'footer.follow_us': 'Ikuti kami:',
    
    // Hotels page
    'hotels.where': 'Di mana',
    'hotels.search_destinations': 'Cari destinasi',
    'hotels.check_in': 'Check in',
    'hotels.check_out': 'Check out',
    'hotels.add_dates': 'Tambah tanggal',
    'hotels.who': 'Siapa',
    'hotels.add_guests': 'Tambah tamu',
    'hotels.guests': 'tamu',
    'hotels.guest': 'tamu',
    'hotels.search': 'Cari',
    'hotels.suggested_destinations': 'Destinasi yang disarankan',
    'hotels.adults': 'Dewasa',
    'hotels.children': 'Anak-anak',
    'hotels.ages_13_above': 'Usia 13 tahun ke atas',
    'hotels.ages_2_12': 'Usia 2-12 tahun',
    'hotels.loading_hotels': 'Memuat hotel...',
    'hotels.no_hotels_found': 'Tidak ada hotel yang sesuai dengan kriteria pencarian Anda.',
    'hotels.search_using_form': 'Cari hotel menggunakan formulir di atas.',
    'hotels.available': 'hotel tersedia',
    'hotels.per_night': 'malam',
    'hotels.night': 'malam',
    'hotels.nights': 'malam',
    'hotels.from': 'mulai dari',
    'hotels.view_details': 'Lihat Detail',
    'hotels.book_now': 'Pesan',
    'hotels.book': 'Pesan',
    'hotels.booking': 'Memesan...',
    'hotels.rating': 'Rating',
    'hotels.reviews': 'ulasan',
    'hotels.free_cancellation': 'Pembatalan gratis',
    'hotels.breakfast_included': 'Sarapan termasuk',
    'hotels.wifi_included': 'WiFi termasuk',
    'hotels.pool': 'Kolam renang',
    'hotels.gym': 'Gym',
    'hotels.spa': 'Spa',
    'hotels.restaurant': 'Restoran',
    'hotels.parking': 'Parkir',
    'hotels.airport_shuttle': 'Shuttle bandara',
    'hotels.pet_friendly': 'Ramah hewan peliharaan',
    'hotels.business_center': 'Pusat bisnis',
    'hotels.concierge': 'Concierge',
    'hotels.room_service': 'Layanan kamar',
    'hotels.laundry': 'Layanan laundry',
    'hotels.currency_selector': 'Mata uang',
    'hotels.amenities': 'Fasilitas',
    'hotels.no_rooms': 'Tidak ada kamar',
    'hotels.sold_out': 'Habis',
    'hotels.available_rooms': 'kamar tersedia',
    'hotels.hotel_not_found': 'Hotel tidak ditemukan',
    'hotels.back_to_hotels': 'Kembali ke Hotel',
    'hotels.select_dates': 'Pilih tanggal Anda',
    'hotels.select_date': 'Pilih tanggal',
    'hotels.stay_summary': 'Ringkasan Menginap',
    'hotels.available_rooms_list': 'Kamar Tersedia',
    'hotels.no_rooms_available': 'Tidak ada kamar tersedia',
    'hotels.total_cost': 'Total biaya',
    'hotels.disclaimer_title': 'Informasi Penting',
    'hotels.disclaimer_1': 'Harga yang ditampilkan adalah per malam dan dapat bervariasi berdasarkan ketersediaan dan musim.',
    'hotels.disclaimer_2': 'Biaya tambahan seperti pajak, biaya layanan, dan biaya resort mungkin berlaku.',
    'hotels.disclaimer_3': 'Ketersediaan kamar tunduk pada konfirmasi pada saat pemesanan.',
    'hotels.disclaimer_4': 'Harap tinjau semua syarat dan ketentuan sebelum menyelesaikan reservasi Anda.',
    
    // Room types
    'room.standard': 'Kamar Standar',
    'room.deluxe': 'Kamar Deluxe',
    'room.suite': 'Suite',
    'room.presidential': 'Suite Presidensial',
    'room.family': 'Kamar Keluarga',
    'room.business': 'Kamar Bisnis',
    'room.accessible': 'Kamar Aksesibilitas',
    'room.smoking': 'Kamar Merokok',
    'room.non_smoking': 'Kamar Non-merokok',
    
    // Amenities
    'amenity.wifi': 'WiFi Gratis',
    'amenity.breakfast': 'Sarapan',
    'amenity.pool': 'Kolam Renang',
    'amenity.gym': 'Pusat Kebugaran',
    'amenity.spa': 'Spa & Kesehatan',
    'amenity.restaurant': 'Restoran',
    'amenity.parking': 'Parkir',
    'amenity.airport_shuttle': 'Shuttle Bandara',
    'amenity.pet_friendly': 'Ramah Hewan Peliharaan',
    'amenity.business_center': 'Pusat Bisnis',
    'amenity.concierge': 'Concierge',
    'amenity.room_service': 'Layanan Kamar 24/7',
    'amenity.laundry': 'Layanan Laundry',
    'amenity.ac': 'AC',
    'amenity.tv': 'TV Layar Datar',
    'amenity.minibar': 'Minibar',
    'amenity.safe': 'Brankas Kamar',
    'amenity.balcony': 'Balkon',
    'amenity.ocean_view': 'Pemandangan Laut',
    'amenity.city_view': 'Pemandangan Kota',
    'amenity.garden_view': 'Pemandangan Taman',
    
    // Booking
    'booking.select_dates': 'Pilih tanggal',
    'booking.select_guests': 'Pilih tamu',
    'booking.total_price': 'Total harga',
    'booking.price_breakdown': 'Rincian harga',
    'booking.taxes_fees': 'Pajak dan biaya',
    'booking.service_fee': 'Biaya layanan',
    'booking.cleaning_fee': 'Biaya pembersihan',
    'booking.security_deposit': 'Deposit keamanan',
    'booking.confirm_booking': 'Konfirmasi Pemesanan',
    'booking.cancellation_policy': 'Kebijakan pembatalan',
    'booking.free_cancellation_until': 'Pembatalan gratis hingga',
    'booking.non_refundable': 'Tidak dapat dikembalikan',
    'booking.partial_refund': 'Pengembalian sebagian tersedia',
    
    // Room Match
    'room_match.title': 'Pencocokan Kamar',
    'room_match.no_more_properties': 'Tidak ada properti lagi!',
    'room_match.seen_all': 'Anda telah melihat semua properti yang tersedia.',
    'room_match.close': 'Tutup',
    'room_match.like': 'Suka',
    'room_match.pass': 'Lewati',
    'room_match.matches': 'Kecocokan',
    'room_match.start_matching': 'Mulai Mencocokkan',
    
    // Common
    'common.loading': 'Memuat...',
    'common.error': 'Kesalahan',
    'common.success': 'Berhasil',
    'common.cancel': 'Batal',
    'common.confirm': 'Konfirmasi',
    'common.save': 'Simpan',
    'common.edit': 'Edit',
    'common.delete': 'Hapus',
    'common.close': 'Tutup',
    'common.back': 'Kembali',
    'common.next': 'Selanjutnya',
    'common.previous': 'Sebelumnya',
    'common.yes': 'Ya',
    'common.no': 'Tidak',
    'common.or': 'atau',
    'common.and': 'dan',
  },
}

// Currency conversion rates (simplified - in real app, these would come from an API)
const currencyRates = {
  GBP: 1,      // Base currency
  THB: 45.5,   // 1 GBP = 45.5 THB
  IDR: 19500,  // 1 GBP = 19,500 IDR
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en')
  const [currency, setCurrencyState] = useState<Currency>('GBP')
  const [isClient, setIsClient] = useState(false)

  // Load language and currency from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('language') as Language
    const savedCurrency = localStorage.getItem('currency') as Currency
    
    if (savedLanguage && ['en', 'th', 'id'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
    
    if (savedCurrency && ['GBP', 'THB', 'IDR'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  // Save language to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem('language', newLanguage)
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLanguage
    }
  }

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const formatPrice = (priceInGBP: number): string => {
    const config = currencyConfig[currency]
    const convertedPrice = priceInGBP * currencyRates[currency]
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(convertedPrice)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
