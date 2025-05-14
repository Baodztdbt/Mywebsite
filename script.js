let map;
let provinceBoundary;
let districtBoundary;
const allMarkersLayerGroup = L.layerGroup(); // LayerGroup cho tất cả marker
const allMarkers = {}; // Đối tượng lưu trữ tất cả marker theo title
let openPopupMarker = null; // Biến để theo dõi marker đang có popup mở

const provinceGeoJSONUrl = 'data/binh_thuan_boundary.geojson';
const districtBoundariesUrl = {
    TuyPhong: 'data/tuy_phong_boundary.geojson',
    BacBinh: 'data/bac_binh_boundary.geojson',
    HamThuanBac: 'data/ham_thuan_bac_boundary.geojson',
    PhanThiet: 'data/phan_thiet_boundary.geojson',
    HamThuanNam: 'data/ham_thuan_nam_boundary.geojson',
    HamTan: 'data/ham_tan_boundary.geojson',
    Lagi: 'data/lagi_boundary.geojson',
    TanHinh: 'data/tanh_linh_boundary.geojson',
    DucLinh: 'data/duc_linh_boundary.geojson',
    PhuQuy: 'data/phu_quy_boundary.geojson'
};

const locationsData = {
    TuyPhong: [
        {lat: 11.22908, lng: 108.72378, title: "Đền thờ Liệt sĩ huyện Tuy Phong", url: "https://example.com/tuy-phong-2", image: "images/tp_dentholietsi.jpg", description: "Đền thờ Liệt sĩ huyện Tuy Phong là công trình tưởng niệm các anh hùng liệt sĩ đã hy sinh trong hai cuộc kháng chiến chống Pháp và chống Mỹ, cũng như trong công cuộc bảo vệ Tổ quốc. Đây là địa chỉ đỏ có ý nghĩa lịch sử, chính trị và giáo dục sâu sắc đối với Đảng bộ, chính quyền và nhân dân huyện Tuy Phong.", address: "Đường 17/4, thị trấn Liên Hương, huyện Tuy Phong"},
        {lat: 11.177093445417215, lng: 108.7038705870402, title: "Nhà tưởng niệm đồng chí Lê Duẩn", url: "https://svhttdl.binhthuan.gov.vn/di-tich-danh-thang-le-hoi-van-hoa/nha-tuong-niem-tong-bi-thu-le-duan-duoc-xep-hang-di-tich-lich-su-van-hoa-cap-tinh-637419.html", image: "images/TP_dentholeduan.jpg", description: "Nhà tưởng niệm Tổng Bí thư Lê Duẩn là nơi ghi nhớ và tri ân những đóng góp to lớn của đồng chí Lê Duẩn - nhà lãnh đạo kiệt xuất của Đảng và cách mạng Việt Nam trong sự nghiệp giải phóng dân tộc, thống nhất đất nước. Đặc biệt, nơi đây gắn liền với dấu ấn lịch sử khi đồng chí từng dừng chân, chỉ đạo công tác kháng chiến tại địa phương vào năm 1947. Nơi đây đã trở thành địa chỉ đỏ trong giáo dục truyền thống cho cán bộ, đảng viên và thế hệ trẻ về tinh thần đấu tranh, lòng yêu nước, ý chí kiên cường và đạo đức cách mạng.", address: "Xã Bình Thạnh, huyện Tuy Phong"},
        {lat: 11.19417, lng: 108.68583, title: "Khu di tích Miếu cát bay", url: "https://svhttdl.binhthuan.gov.vn/1328/32910/59896/602487/di-tich-danh-thang-le-hoi-van-hoa/ve-xa-binh-thanh-ghe-tham-khu-di-tich-lich-su-cat-bay.html", image: "images/TP_mieucatbay.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc. Vào ngày rằm tháng Giêng năm 1951, quân đội Pháp thực hiện cuộc hành quân mang tên 'Sang et feu' (Máu và lửa) tại làng Cát Bay, thảm sát 311 dân thường và đốt cháy 200 ngôi nhà. Đây là một trong những vụ thảm sát lớn nhất tại Tuy Phong trong thời kỳ kháng chiến chống Pháp.", address: "Thôn Đông Bình, xã Bình Thạnh, huyện Tuy Phong"},
        {lat: 11.181542934537518, lng: 108.61659155886373, title: "Chùa Phước An (Cửa Duồng)", url: "https://baotayninh.vn/tham-chua-phuoc-an-binh-thuan-a6380.html", image: "images/tp_chuaphuocan.jpg", description: "Chùa Phước An là nơi Chủ tịch Hồ Chí Minh từng dừng chân trên đường vào Nam tìm đường cứu nước. Tại đây, Người đã gặp gỡ nhà yêu nước Trương Gia Mô, người sau đó giới thiệu Bác vào Phan Thiết để dạy học tại Trường Dục Thanh.", address: "thôn Hà Thủy 1, xã Chí Công, Huyện Tuy Phong"},
        {lat: 11.266696, lng: 108.692205, title: "Tháp Po Dam (Pô Tằm)", url: "https://baobinhthuan.com.vn/di-tich-van-hoa-lich-su-quoc-gia-thap-po-dam-po-tam-o-tuy-phong-124375.html", image: "images/tp_thappodam.jpg", description: "Tháp Po Dam là một trong những di tích lịch sử mang đậm dấu ấn văn hóa Champa cổ xưa, thể hiện sự giao thoa văn hóa và lịch sử lâu đời của vùng đất Tuy Phong.", address: "xã Phú Lạc, Huyện Tuy Phong"},
    ],
    BacBinh: [
        {lat: 11.061542788264566, lng: 108.3066617011287, title: "Chiến khu Lê Hồng Phong", url: "https://example.com/bac-binh-1", image: "images/bb_bialehongphong.jpg", description: "Được thành lập vào năm 1950, Chiến khu Lê Hồng Phong là căn cứ địa của Tỉnh ủy Bình Thuận và Ban Cán sự cực Nam Trung Bộ trong kháng chiến chống Pháp. Với địa hình rừng rậm, đồi cát và cây gai chằng chịt, khu vực này thuận lợi cho việc ẩn náu và tổ chức kháng chiến. Trong suốt thời gian từ 1950 đến 1975, dù bị địch bao vây và đánh phá ác liệt, quân và dân Khu Lê vẫn kiên cường bám trụ, chiến đấu anh dũng, góp phần vào sự nghiệp giải phóng quê hương và thống nhất đất nước", address: "xã Hồng Phong, huyện Bắc Bình"},
        {lat: 11.2600, lng: 108.4000, title: "Võ Làng Đa Phước", url: "https://example.com/bac-binh-1", image: "images/bb_dinhlangxuanan.jpg", description: "Võ Làng Đa Phước là một di tích lịch sử cách mạng quan trọng tại huyện Bắc Bình. Nơi đây từng là điểm canh gác, bảo vệ xóm làng thuộc hệ thống trạm giao liên dưới các triều vua nhà Nguyễn. Trong thời kỳ kháng chiến chống Pháp, Võ Làng Đa Phước trở thành điểm liên lạc, móc nối cơ sở trong vùng địch hậu, hỗ trợ hoạt động diệt ác, trừ gian và tiếp tế lương thực cho cách mạng.", address: "Thị trấn Chợ Lầu, huyện Bắc Bình"},
        {lat: 11.219784559118155, lng: 108.5029449699087, title: "Chùa Xuân An", url: "https://example.com/bac-binh-1", image: "images/bb_chuaxuanan.jpg", description: "Được xây dựng vào năm 1794, Chùa Xuân An là một cơ sở cách mạng quan trọng trong kháng chiến chống Mỹ. Năm 1969, nơi đây được sử dụng để đào hầm bí mật, tạo điều kiện cho đội công tác hoạt động và chỉ đạo phong trào cách mạng tại địa phương.", address: "Thị trấn Chợ Lầu, huyện Bắc Bình"}
    ],
    HamThuanBac: [
        {lat: 11.153838212696964, lng: 107.9218587527147, title: "Khu căn cứ Tỉnh ủy Bình Thuận", url: "https://example.com/ham-thuan-bac-1", image: "images/saluon.jpg", description: "Khu di tích căn cứ Tỉnh ủy Bình Thuận trong kháng chiến chống Mỹ được UBND tỉnh xếp hạng di tích cấp tỉnh năm 2019, có quy mô diện tích hơn 10 ha nằm trong rừng Sa Lôn. Nơi đây còn lưu giữ nhiều dấu tích như: Nhà làm việc, hội trường, hầm trú ẩn của các đồng chí lãnh đạo, nhà làm việc của các cơ quan, đơn vị tham mưu, phục vụ, bếp Hoàng Cầm… Đây là nơi 6 đồng chí Bí thư Tỉnh ủy trong kháng chiến chống Mỹ đã sống, làm việc và lãnh đạo phong trào cách mạng của Đảng bộ tỉnh nhà.", address: "Thôn 3, xã Đông Giang, huyện Hàm Thuận Bắc"},
        {lat: 11.1450, lng: 108.0000, title: "Đài chiến thắng Sông Quao", url: "https://example.com/ham-thuan-bac-2", image: "images/htb_songquao.jpg", description: "Đài Chiến thắng Sông Quao là một trong những địa chỉ đỏ quan trọng, nơi ghi dấu những chiến công lẫy lừng của quân và dân Hàm Thuận trong thời kỳ kháng chiến chống Mỹ cứu nước. Đây là tượng đài kỷ niệm chiến thắng trong cuộc kháng chiến chống thực dân Pháp của quân dân vùng Bình Thuận.", address: "Thôn Dân Hòa, xã Thuận Hòa, huyện Hàm Thuận Bắc"},
        {lat: 11.097871881332951, lng: 108.19395212332083, title: "Nghĩa trang Liệt sỉ tỉnh Bình Thuận", url: "https://nghiatranglietsi.binhthuan.gov.vn", image: "images/htb_ntls.jpg", description: "Nghĩa trang Liệt sĩ tỉnh Bình Thuận là công trình ghi dấu công lao của hàng ngàn anh hùng liệt sĩ đã hy sinh vì độc lập - tự do của Tổ quốc. Đây là một trong những địa chỉ đỏ tiêu biểu trên địa bàn tỉnh, mang giá trị lịch sử, tâm linh và giáo dục truyền thống sâu sắc.", address: " xã Hồng Sơn, huyện Hàm Thuận Bắc"},
        {lat: 11.053291139337503, lng: 108.12737227911337, title: "Nhà truyền thống Hàm Thuận Bắc", url: "https://example.com/ham-thuan-bac-2", image: "images/hamthuanbac2.jpg", description: "Nhà truyền thống huyện Hàm Thuận Bắc là một địa chỉ đỏ quan trọng, nơi lưu giữ và trưng bày nhiều hiện vật, tài liệu quý giá về lịch sử đấu tranh cách mạng của Đảng bộ và nhân dân huyện trong hai cuộc kháng chiến chống Pháp và chống Mỹ. Đây cũng là nơi giáo dục truyền thống yêu nước cho thế hệ trẻ và là điểm đến của nhiều đoàn khách tham quan, học tập.", address: "Thị trấn Ma Lâm, huyện Hàm Thuận Bắc"}
    ],
    PhanThiet: [
        {lat: 10.928843937251285, lng: 108.09548085271085, title: "Bảo tàng Hồ Chí Minh", url: "https://binhthuan.hochiminh.vn", image: "images/PT_baotanghcm.jpg", description: "Bảo tàng Hồ Chí Minh được thành lập vào ngày 19/5/1986, bao gồm quần thể di tích trải rộng trên diện tích gần 10.000 m2 với lối kiến trúc kết hợp giữa văn hóa truyền thống và hiện đại gồm tổng thể các hạng mục công trình lịch sử, văn hóa như: Khu di tích Trường Dục Thanh, Nhà Bảo tàng về Chủ tịch Hồ Chí Minh và tượng đài Bác Hồ với thiếu nhi. Đây là trung tâm nghiên cứu, tuyên truyền, giới thiệu thân thế, cuộc đời, sự nghiệp về Chủ tịch Hồ Chí Minh ở miền cực Nam Trung bộ và là trung tâm sinh hoạt chính trị, văn hóa của tỉnh Bình Thuận", address: "Số 39 Trưng Nhị, phường Đức Nghĩa, TP. Phan Thiết."},
        {lat: 10.92872180863295, lng: 108.09583285086141, title: "Trường Dục Thanh", url: "https://binhthuan.hochiminh.vn", image: "images/truongducthanh.jpg", description: "Được thành lập năm 1907 bởi các sĩ phu yêu nước hưởng ứng phong trào Duy Tân, Trường Dục Thanh là nơi Chủ tịch Hồ Chí Minh từng dạy học trước khi vào Sài Gòn năm 1911. Hiện nay, trường được bảo tồn gần như nguyên vẹn, là điểm đến giáo dục truyền thống quan trọng.", address: "Số 39 Trưng Nhị, phường Đức Nghĩa, TP. Phan Thiết"},
        {lat: 10.929439402544933, lng: 108.09989544057322, title: "Tháp nước Phan Thiết", url: "https://binhthuan.hochiminh.vn", image: "images/pt_thapnuoc.jpg", description: "Tháp nước Phan Thiết được khởi công xây dựng vào năm 1928 và hoàn thành đưa vào sử dụng năm 1934, là công trình thu hút được sự quan tâm của nhiều du khách gần xa và là biểu tượng của tỉnh Bình Thuận. Tháp tọa lạc bên dòng Cà Ty hiền hòa, mang trong mình nhiều kiến trúc nghệ thuật độc đáo chứa đựng nhiều giá trị về lịch sử, văn hóa. Ngoài ra, đây còn là một công trình hữu nghị, thể hiện tình đoàn kết, gắn bó keo sơn gắn bó của hai dân tộc Việt - Lào anh em, là món quà quý giá mà Hoàng thân Xuphanuvông đã để lại trên mảnh đất Phan Thiết."},
        {lat: 10.929531840189126, lng: 108.10456992209377, title: "Tường Đài Chiến thắng", url: "http://tuongdaichienthang.baotangbinhthuan.com", image: "images/pt_tuongdaichienthang.jpg", description: "Tượng đài Chiến thắng Phan Thiết là một công trình lịch sử - văn hóa quan trọng, được xây dựng để tưởng niệm và tôn vinh chiến công của quân và dân Bình Thuận trong cuộc kháng chiến chống Mỹ, đặc biệt là Chiến dịch giải phóng Phan Thiết vào ngày 19/4/1975, góp phần vào thắng lợi chung của Chiến dịch Hồ Chí Minh lịch sử.", address: "C12 Trần Hưng Đạo, Bình Hưng, TP. Phan Thiết"},
        {lat: 10.92920945034225, lng: 108.10061110334125, title: "Nhà truyền thống LLVT tỉnh Bình Thuận", url: "https://binhthuan.hochiminh.vn", image: "images/pt_nhatruyenthongllvt.jpg", description: "Nhà truyền thống Lực lượng vũ trang tỉnh Bình Thuận là một công trình văn hóa - lịch sử quan trọng, nhằm ghi dấu, lưu giữ và trưng bày những tư liệu, hiện vật quý giá về quá trình hình thành, chiến đấu và trưởng thành của lực lượng vũ trang tỉnh qua các thời kỳ kháng chiến và xây dựng, bảo vệ Tổ quốc.", address: "Đường Hải Thường Lãn Ông, Phú Trinh, Thành phố Phan Thiết"},
        {lat: 10.924844163723225, lng: 108.09722622951787, title: "Đình làng Đức Thắng", url: "https://binhthuan.hochiminh.vn", image: "images/pt_dinhlangducthang.jpg", description: "Đình làng Đức Thắng không chỉ là một di tích văn hóa - tín ngưỡng truyền thống mà còn gắn với yếu tố lịch sử cách mạng, đặc biệt trong thời kỳ kháng chiến chống Pháp và chống Mỹ ở Bình Thuận. Trong thời kỳ kháng chiến, nhất là giai đoạn 1945-1975, đình làng Đức Thắng cùng với nhiều thiết chế truyền thống khác ở Phan Thiết đã được nhân dân sử dụng làm nơi hội họp bí mật, cất giấu tài liệu, lương thực và che giấu cán bộ hoạt động cách mạng", address: "Triệu Quang Phục, Đức Nghĩa, Tp. Phan Thiết"},
        {lat: 10.944036573023704, lng: 108.09885005215394, title: "Đền thờ Liệt sĩ Tp. Phan Thiết", url: "https://binhthuan.hochiminh.vn", image: "images/pt_dentholietsi.jpg", description: "Đền thờ liệt sĩ thành phố Phan Thiết là một công trình tưởng niệm có ý nghĩa đặc biệt, là nơi ghi nhớ và tri ân những người con ưu tú của thành phố đã hy sinh vì sự nghiệp giải phóng dân tộc, thống nhất đất nước và bảo vệ Tổ quốc. Đây cũng là một địa chỉ đỏ trong công tác giáo dục truyền thống yêu nước, lý tưởng cách mạng cho thế hệ trẻ tại địa phương.", address: "241 Đường Đặng Văn Lãnh, Xuân An, Tp Phan Thiết"},
    ],
    HamThuanNam: [
        {lat: 10.847868017748226, lng: 107.87744372081548, title: "Đài tưởng niệm Anh hùng Liệt sĩ", url: "https://example.com/ham-thuan-nam-1", image: "images/hamthuannam1.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc."},
        {lat: 10.695467911089402, lng: 107.99213302333028, title: "Hải Đăng Khe Gà", url: "https://example.com/ham-thuan-nam-1", image: "images/hamthuannam1.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc."},
        {lat: 10.828136616743695, lng: 107.8830230988062, title: "Cụm di tích Núi Tà Kú", url: "https://example.com/ham-thuan-nam-1", image: "images/hamthuannam1.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc."}
    ],
    HamTan: [
        {lat: 10.7227, lng: 107.7252, title: "Đài tưởng niệm Anh hùng Liệt sĩ", url: "https://example.com/ham-tan-1", image: "images/hamtan1.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc."}
    ],
    Lagi: [
        {lat: 10.708647273125708, lng: 107.84298876618611, title: "Khu di tích Chi bộ Tam Tân", url: "https://example.com/lagi-1", image: "images/lg_docongbang.jpg", description: "Khu di tích Chi bộ Tam Tân (còn gọi là Di tích lịch sử cách mạng Dốc Ông Bằng) nằm tại xã Tân Tiến, thị xã La Gi, tỉnh Bình Thuận. Đây là nơi ghi dấu sự kiện thành lập Chi bộ Đảng Cộng sản đầu tiên của tỉnh Bình Thuận vào cuối năm 1930, đánh dấu bước ngoặt quan trọng trong phong trào cách mạng của địa phương.", address: "xã Tân Tiến, thị xã Lagi"},
        {lat: 10.708647273125708, lng: 107.84298876618611, title: "Đền thờ liệt sĩ thị xã Lagi", url: "https://example.com/lagi-1", image: "images/lg_docongbang.jpg", description: "Khu di tích Chi bộ Tam Tân (còn gọi là Di tích lịch sử cách mạng Dốc Ông Bằng) nằm tại xã Tân Tiến, thị xã La Gi, tỉnh Bình Thuận. Đây là nơi ghi dấu sự kiện thành lập Chi bộ Đảng Cộng sản đầu tiên của tỉnh Bình Thuận vào cuối năm 1930, đánh dấu bước ngoặt quan trọng trong phong trào cách mạng của địa phương.", address: "xã Tân Tiến, thị xã Lagi"}
    ],
    TanHinh: [
        {lat: 11.204181271052958, lng: 107.7103831815511, title: "Khu di tích cách mạng Hoài Đức-Bắc Ruộng", url: "https://example.com/tanh-linh-1", image: "images/tl_hoaiduc.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc."},
        {lat: 11.214181271052958, lng: 107.8103831815511, title: "Căn cứ Tỉnh ủy Bình Tuy - Tiểu khu 368", url: "https://baobinhthuan.com.vn/can-cu-tinh-uy-binh-tuy-dau-an-lich-su-trong-khang-chien-chong-de-quoc-129411.html#:~:text=Căn%20cứ%20Tỉnh%20ủy%20Bình%20Tuy%20trong%20kháng%20chiến%20chống,Đức%20Thuận%2C%20huyện%20Tánh%20Linh", image: "images/tl_hoaiduc.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc."}
    ],
    DucLinh: [
        {lat: 11.24684144062448, lng: 107.59023893760207, title: "Căn cứ kháng chiến Đồi Lồ Ô", url: "https://example.com/duc-linh-1", image: "images/dl_doiloo.jpg", description: "Trong kháng chiến chống Mỹ (1964-1975), Đồi Lồ Ô là nơi trú ẩn và hoạt động của quân và dân Sùng Nhơn. Nơi đây ghi dấu tinh thần kiên cường, chịu đựng gian khổ và chiến đấu anh dũng, đặc biệt là trận đánh năm 1969 tiêu diệt và làm bị thương 22 tên địch. Di tích được xếp hạng cấp tỉnh vào năm 2023.", address: "xã Sùng Nhơn, huyện Đức Linh"},
        {lat: 11.24917753949252, lng: 107.63744688648313, title: "Di tích chiến thắng Xóm Mười Nhà", url: "https://example.com/duc-linh-1", image: "images/dl_dtmuoinha.jpg", description: "Nơi tưởng niệm các anh hùng liệt sĩ đã hy sinh vì Tổ quốc.", address: "Thôn 4, xã Mê Pu, huyện Đức Linh"},
        {lat: 11.151620378369559, lng: 107.5037137686829, title: "Đài Chiến thắng Hoài Đức", url: "https://example.com/duc-linh-1", image: "images/dl_daihoaiduc.jpg", description: " Đài chiến thắng Hoài Đức - Đức Linh là chứng tích ghi lại sự kiện lịch sử hào hùng diễn ra cách đây 49 năm, quân và dân ta đã tiêu diệt Chi khu quận lỵ Hoài Đức (nay là thị trấn Đức Tài, huyện Đức Linh). Chiến dịch tấn công tiêu diệt Chi khu quận lỵ Hoài Đức mang tính chất quyết định đối với việc giải phóng hoàn toàn huyện Hoài Đức vào ngày 23/3/1975. Thắng lợi của Chiến dịch Hoài Đức mãi mãi đi vào lịch sử như một dấu son rực rỡ đầy tự hào của Quân khu VI, quân và dân huyện Đức Linh trong cuộc kháng chiến chống Mỹ cứu nước.",address: "Thị trấn Đức Tài, huyện Đức Linh"},
        {lat: 11.154151, lng: 107.535828, title: "Khu di tích Núi Dinh", url: "https://example.com/duc-linh-1", image: "images/dl_nuidinh.jpg", description: "Di tích Núi Dinh (xã Nam Chính, huyện Đức Linh, tỉnh Bình Thuận) là một địa danh lịch sử cách mạng quan trọng, nơi diễn ra trận đánh kéo dài 103 ngày đêm góp phần giải phóng huyện Hoài Đức vào ngày 23/3/1975. Với vị trí chiến lược, Núi Dinh từng là căn cứ kháng chiến vững chắc của quân và dân ta trong cuộc kháng chiến chống Mỹ. Năm 2024, nơi đây được công nhận là di tích lịch sử cấp tỉnh, trở thành “địa chỉ đỏ” giáo dục truyền thống cho thế hệ trẻ.",address: "Thị trấn Đức Tài, huyện Đức Linh"},
        {lat: 11.147447846879857, lng: 107.5053244938332, title: "Đình làng Võ Đắt", url: "https://example.com/duc-linh-1", image: "images/dl_vodac.jpg", description: "Đình làng Võ Đắt là nơi tổ chức lễ hội truyềnthống dân gian của dân tộc; là nơi giáo dục thế hệ trẻ bảo tồn và phát huy văn hóa dân tộc, góp phần xây dựng và phát triển nền văn hóa Việt Nam tiên tiến đậm đà bản sắc dân tộc; khơi dậy lòng yêu quê hương, yêu Tổ quốc; phát huy đạo lý “Uống nước nhớ nguồn” và cùng chung sức, chung lòng xây dựng quê hương, đất nước ngày càng phồn vinh, văn minh hơn..", address: "Thị trấn Đức Tài, huyện Đức Linh"},
        {lat: 11.147447846879857, lng: 107.5053244938332, title: "Đền thờ Liệt sĩ huyện Đức Linh", url: "https://example.com/duc-linh-1", image: "images/dl_vodac.jpg", description: "Đình làng Võ Đắt là nơi tổ chức lễ hội truyềnthống dân gian của dân tộc; là nơi giáo dục thế hệ trẻ bảo tồn và phát huy văn hóa dân tộc, góp phần xây dựng và phát triển nền văn hóa Việt Nam tiên tiến đậm đà bản sắc dân tộc; khơi dậy lòng yêu quê hương, yêu Tổ quốc; phát huy đạo lý “Uống nước nhớ nguồn” và cùng chung sức, chung lòng xây dựng quê hương, đất nước ngày càng phồn vinh, văn minh hơn..", address: "Thị trấn Đức Tài, huyện Đức Linh"}
    ],
    PhuQuy: [
        {lat: 10.51202656260248, lng: 108.96589979503294, title: "Cột cờ chủ quyền Tổ Quốc", url: "https://example.com/phu-quy-1", image: "images/PQ_cotco.jpg", description: "Cột cờ Phú Quý là biểu tượng mạnh mẽ khẳng định chủ quyền lãnh thổ quốc gia trên vùng biển đảo thiêng liêng của đất nước; là địa chỉ đỏ để giáo dục truyền thống cho thế hệ trẻ. Hình ảnh lá cờ Tổ quốc tung bay trên đảo xa gợi nhắc đến bao thế hệ cha ông đã chiến đấu, gìn giữ từng tấc đất, từng hòn đảo thiêng liêng. Đây là nơi để mỗi người con đất Việt thêm yêu biển đảo quê hương, nhận thức rõ hơn về trách nhiệm của mình đối với Tổ quốc.", address: "thôn Triều Dương, xã Tam Thanh, huyện Phú Quý"}
    ]
};

function createRedMarker(lat, lng, title, url, image, description, address) {
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [12, 20],
        iconAnchor: [6, 20],
        popupAnchor: [1, -17],
        shadowSize: [20, 20]
    });
    let popupContent = `<div style="width: 220px; word-break: break-word;">`;
    popupContent += `<b>${title}</b><br>`;
    if (image) {
        popupContent += `<img src="${image}" alt="${title}" style="width:220px;height:150px;"><br>`;
    }
    if (description) {
        popupContent += `<p style="margin-top: 5px; text-align: justify; font-style: normal; line-height: 1.4; margin-bottom: 1px;">${description}</p><br><hr style="border-top: 1px solid #ccc; margin: 5px 0;">`; // Thêm đường gạch ngang
    } else {
        popupContent += `<hr style="border-top: 1px solid #ccc; margin: 5px 0;">`; // Thêm đường gạch ngang nếu không có mô tả
    }
    popupContent += `<i class="fas fa-map-marker-alt"; style="color: rgb(245, 4, 4); margin-right: 5px;"></i> Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>`;
    if (address) { // Kiểm tra nếu có địa chỉ
        popupContent += `<i class="fas fa-map-pin"; style="color:rgb(4, 61, 147); margin-right: 5px; margin-top: 2px;"></i> Địa chỉ: ${address}<br>`;
    }
    popupContent += `<i class="fas fa-car"; style="color: rgb(4, 61, 147); margin-right: 5px;"></i> <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank">Đường đi</a><br>`;
    if (url) {
        popupContent += `<i class="fas fa-globe"; style="color: rgb(4, 61, 147); margin-right: 5px;"></i> <a href="${url}" target="_blank">Website</a>`;
    }
    popupContent += `</div>`;
    const marker = L.marker([lat, lng], { icon: redIcon }).bindPopup(popupContent, { maxWidth: 250 });
    allMarkers[title] = marker;
    return marker;
}

function loadGeoJSON(url, style, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const layer = L.geoJSON(data, {
                style: style
            }).addTo(map);
            if (callback) {
                callback(layer);
            }
        })
        .catch(error => console.error('Lỗi tải GeoJSON:', error));
}

function highlightDistrict(region) {
    if (districtBoundary) {
        map.removeLayer(districtBoundary);
        districtBoundary = null;
    }
    const districtUrl = districtBoundariesUrl[region];
    if (districtUrl) {
        loadGeoJSON(districtUrl, {
            fillColor: 'yellow',
            color: 'blue',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        }, (layer) => {
            districtBoundary = layer;
            layer.addTo(map);
            const bounds = layer.getBounds(); // Thêm dòng này
            const center = bounds.getCenter(); // Thêm dòng này
            map.panTo(center); // Thêm dòng này
        });
    } else {
        // Thêm khối else này
        if (provinceBoundary) {
            map.panTo(provinceBoundary.getBounds().getCenter());
        } else {
            map.panTo([10.93, 108.10]);
        }
    }
}

function showProvinceBoundary(){
    if (provinceBoundary) {
        map.removeLayer(provinceBoundary);
    }
    loadGeoJSON(provinceGeoJSONUrl, {
        color: 'blue',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0
    }, (layer) => {
        provinceBoundary = layer;
        provinceBoundary.addTo(map); // Thêm layer vào bản đồ ngay khi tải xong
       map.fitBounds(provinceBoundary.getBounds(), { maxZoom: 10 });// Tự động fit bounds khi tải xong
    });
}

function resetMapToInitialState() {
    showProvinceBoundary(); // Gọi lại showProvinceBoundary để hiển thị và fit bounds
}
document.addEventListener('DOMContentLoaded', function() {
    map = L.map('map').setView([10.93, 108.10],9);
    const zoomControl = L.control.zoom({ position: 'topright' });
    zoomControl.addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    showProvinceBoundary();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    map.on('click', function(e) {
        // Kiểm tra xem click có phải trên một marker hay không
        if (e.originalEvent.target.classList.contains('leaflet-marker-icon')) {
            // Nếu là click trên marker, không làm gì cả
            return;
        }
    
        // Nếu không phải click trên marker, reset bản đồ về trạng thái ban đầu
        resetMapToInitialState();
    
        // Nếu có ranh giới huyện đang hiển thị, hãy xóa nó
        if (districtBoundary) {
            map.removeLayer(districtBoundary);
            districtBoundary = null;
        }
    
        // Đóng popup đang mở (nếu có)
        if (openPopupMarker && openPopupMarker.isPopupOpen()) {
            openPopupMarker.closePopup();
            openPopupMarker = null;
        }
        
    });

    showProvinceBoundary();

    const locationButtonWrappers = document.querySelectorAll('.location-button-wrapper');
    const aboutButton = document.getElementById('about-button');
const aboutPopup = document.getElementById('about-popup');
const closeButton = aboutPopup.querySelector('.close-button');
const popupOverlay = document.querySelector('.popup-overlay'); // Lấy overlay từ HTML

aboutButton.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của nút (nếu là thẻ <a>)
    aboutPopup.classList.add('active');
    popupOverlay.classList.add('active');
});

closeButton.addEventListener('click', function() {
    aboutPopup.classList.remove('active');
    popupOverlay.classList.remove('active');
});
const contactButton = document.getElementById('contact-button');
const contactPopup = document.getElementById('contact-popup');
const closeButtons = document.querySelectorAll('.popup .close-button'); // Lấy TẤT CẢ nút đóng


contactButton.addEventListener('click', function(event) {
    event.preventDefault();
    contactPopup.classList.add('active');
    popupOverlay.classList.add('active');
});

// Sửa đổi event listener cho nút đóng để xử lý tất cả popup
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const parentPopup = this.closest('.popup');
        parentPopup.classList.remove('active');
        popupOverlay.classList.remove('active');
    });
    const currentDateMenu = document.getElementById('current-date-menu');

function updateCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    currentDateMenu.textContent = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Cập nhật ngày giờ ngay khi trang tải
updateCurrentDate();

// Cập nhật ngày giờ mỗi giây
setInterval(updateCurrentDate, 1000);
});


// Sửa đổi event listener cho overlay để đóng tất cả popup đang mở
popupOverlay.addEventListener('click', function() {
    const activePopups = document.querySelectorAll('.popup.active');
    activePopups.forEach(popup => popup.classList.remove('active'));
    popupOverlay.classList.remove('active');
});

// Thêm event listener cho TẤT CẢ popup để ngăn chặn lan tỏa click
document.querySelectorAll('.popup').forEach(popup => {
    popup.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

popupOverlay.addEventListener('click', function() {
    aboutPopup.classList.remove('active');
    popupOverlay.classList.remove('active');
});

// Ngăn chặn sự kiện click bên trong popup lan ra overlay và đóng popup
aboutPopup.addEventListener('click', function(event) {
    event.stopPropagation();
});
   // Xử lý sự kiện click cho nút "Home"
const homeButton = document.getElementById('home-button');
if (homeButton) {
    homeButton.addEventListener('click', function(event) {
        event.preventDefault();
        resetMapToInitialState();
        // Nếu có ranh giới huyện đang hiển thị, hãy xóa nó khi về Home
        if (districtBoundary) {
            map.removeLayer(districtBoundary);
            districtBoundary = null;
        }
        // Đóng popup đang mở (nếu có)
        if (openPopupMarker && openPopupMarker.isPopupOpen()) {
            openPopupMarker.closePopup();
            openPopupMarker = null;
        }
    });
}
    // Tạo và thêm tất cả marker vào layerGroup và đối tượng allMarkers
    for (const region in locationsData) {
        locationsData[region].forEach(location => {
            const marker = createRedMarker(location.lat, location.lng, location.title, location.url, location.image, location.description, location.address);
            allMarkersLayerGroup.addLayer(marker);
        });
    }
    // Thêm layerGroup chứa tất cả marker vào bản đồ để hiển thị chúng
    allMarkersLayerGroup.addTo(map);

    locationButtonWrappers.forEach(wrapper => {
        const button = wrapper.querySelector('.location-button');
        const detailsContainer = wrapper.querySelector('.location-details');
        const region = button.dataset.region;

        button.addEventListener('click', function(event) {
            event.preventDefault();
            highlightDistrict(region);

            // Đóng popup đang mở (nếu có)
            if (openPopupMarker && openPopupMarker.isPopupOpen()) {
                openPopupMarker.closePopup();
                openPopupMarker = null;
            }

            // Kiểm tra nếu detailsContainer tồn tại trước khi thao tác
            if (detailsContainer) {
                detailsContainer.innerHTML = '';
                const locations = locationsData[region];
                if (locations && locations.length > 0) {
                    locations.forEach(location => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('span'); // Thay thẻ 'a' bằng 'span'
                        link.textContent = location.title;
                        link.style.cursor = 'pointer'; // Thêm cursor pointer

                        link.addEventListener('click', function() {
                            if (allMarkers[location.title]) {
                                allMarkers[location.title].openPopup(); // Mở popup của marker
                                openPopupMarker = allMarkers[location.title]; // Cập nhật marker đang có popup mở
                            }
                        });
                        listItem.appendChild(link);
                        detailsContainer.appendChild(listItem);
                    });
                } else {
                    const listItem = document.createElement('li');
                    listItem.textContent = 'Không có địa chỉ đỏ.';
                    detailsContainer.appendChild(listItem);
                }
                detailsContainer.style.display = 'block';
            }
        });

        wrapper.addEventListener('mouseleave', function() {
            // Kiểm tra nếu detailsContainer tồn tại trước khi thao tác
            if (detailsContainer) {
                detailsContainer.style.display = 'none';
            }
        });
    });
});