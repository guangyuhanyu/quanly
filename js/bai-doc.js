/* KHO BÀI ĐỌC PHÂN CẤP HSK 7–9 — bài viết riêng cho Thầy (bản 6.0)
   Mỗi bài: đoạn văn (zh) + bản dịch (vi), từ khó (gl), câu hỏi hiểu bài (hoi: [câu, [4 lựa chọn], đáp án 0-3]). */
const BAI_DOC = [
  {
    id: 'b01', bo: ['为人'], cap: 7, chu_de: 'Công việc', ten: '数字游民：在路上工作', vi_ten: 'Du mục kỹ thuật số: làm việc trên đường đi',
    doan: [
      ['近年来，“数字游民”一词频繁出现在社交媒体上。所谓数字游民，是指借助互联网远程办公、不受固定工作地点约束的人群。他们或许今天在大理的民宿里写代码，下个月又出现在清迈的咖啡馆里开视频会议。', 'Những năm gần đây, cụm từ "du mục kỹ thuật số" xuất hiện dày đặc trên mạng xã hội. Du mục kỹ thuật số là những người làm việc từ xa qua Internet, không bị ràng buộc vào một nơi làm việc cố định. Hôm nay họ có thể viết code trong một homestay ở Đại Lý, tháng sau lại họp video trong một quán cà phê ở Chiang Mai.'],
      ['这种生活方式之所以吸引年轻人，一方面在于它打破了“朝九晚五”的束缚，让工作与旅行得以兼顾；另一方面，较低的生活成本也使不少人得以在一线城市之外找到平衡。不少人表示，换个环境往往能带来新的灵感，也能拓展自己的视野。', 'Lối sống này hấp dẫn người trẻ, một mặt vì nó phá vỡ sự trói buộc "chín giờ sáng đến năm giờ chiều", cho phép vừa làm việc vừa du lịch; mặt khác, chi phí sinh hoạt thấp hơn giúp nhiều người tìm được sự cân bằng bên ngoài các thành phố lớn. Nhiều người nói đổi môi trường thường mang lại cảm hứng mới, lại mở rộng được tầm nhìn.'],
      ['然而，光鲜的照片背后也有不为人知的代价。收入波动大、雇主随时可能终止合约、社会保障缺失、长期漂泊带来的孤独感，都是数字游民必须面对的现实。有资深从业者指出，自由并非没有边界，能否持续，取决于个人的职业技能与自律程度。', 'Tuy nhiên, đằng sau những bức ảnh hào nhoáng là cái giá ít ai biết. Thu nhập dao động mạnh, chủ thuê có thể chấm dứt hợp đồng bất cứ lúc nào, thiếu bảo hiểm xã hội, cảm giác cô đơn vì trôi dạt lâu ngày đều là thực tế mà người du mục phải đối mặt. Một người làm nghề lâu năm cho rằng tự do không phải không có giới hạn; có duy trì được hay không phụ thuộc vào kỹ năng nghề nghiệp và mức độ tự kỷ luật của mỗi người.'],
      ['归根结底，数字游民并不是逃避工作的捷径，而是一种对工作方式的重新选择。它提醒我们：在技术驱动劳动形态加速转型的今天，“在哪里工作”也许不再重要，“如何工作”才是关键。', 'Suy cho cùng, du mục kỹ thuật số không phải lối tắt để trốn việc, mà là một cách chọn lại phương thức làm việc. Nó nhắc chúng ta rằng: trong thời đại công nghệ thúc đẩy hình thái lao động chuyển đổi nhanh, "làm việc ở đâu" có lẽ không còn quan trọng, "làm việc như thế nào" mới là then chốt.'],
    ],
    gl: [['不为人知', 'bùwéirénzhī', 'ít ai biết'], ['民宿', 'mínsù', 'nhà nghỉ kiểu homestay'], ['束缚', 'shùfù', 'trói buộc, ràng buộc'], ['兼顾', 'jiāngù', 'lo được cả hai'], ['漂泊', 'piāobó', 'trôi dạt, phiêu bạt'], ['自律', 'zìlǜ', 'tự kỷ luật'], ['归根结底', 'guīgēn-jiédǐ', 'suy cho cùng'], ['捷径', 'jiéjìng', 'đường tắt']],
    hoi: [
      ['根据第一段，数字游民的主要特点是？', ['只在国外工作', '借助网络远程工作，地点不固定', '专门从事旅游行业', '没有任何收入'], 1],
      ['下列哪一项不是文中提到的代价？', ['收入不稳定', '缺乏社会保障', '孤独感', '签证费用太高'], 3],
      ['作者的观点是？', ['数字游民是在逃避工作', '“如何工作”比“在哪里工作”更关键', '年轻人都应该成为数字游民', '一线城市生活成本低'], 1],
    ],
  },
  {
    id: 'b02', cap: 7, chu_de: 'Đô thị', ten: '城市里的“十五分钟生活圈”', vi_ten: '"Vòng sinh hoạt 15 phút" trong thành phố',
    doan: [
      ['早上出门买早点，步行五分钟就有菜市场；孩子上学不用穿过马路；社区里有卫生服务站，老人看病不必排长队——这正是不少城市近年来推行的一项民生举措：“十五分钟生活圈”。', 'Sáng ra ngoài mua đồ ăn sáng, đi bộ năm phút là tới chợ; con đi học không phải băng qua đường lớn; trong khu dân cư có trạm y tế, người già đi khám không phải xếp hàng dài — đó chính là một biện pháp vì dân sinh mà nhiều thành phố triển khai mấy năm nay: "vòng sinh hoạt 15 phút".'],
      ['这一理念源于城市规划领域，核心思想是：居民在步行十五分钟的范围内，就能满足日常生活的基本需求，涵盖购物、教育、医疗和休闲等方面。目前，已有多个城市开展试点。', 'Ý tưởng này bắt nguồn từ lĩnh vực quy hoạch đô thị, cốt lõi là: trong phạm vi đi bộ 15 phút, cư dân có thể đáp ứng các nhu cầu sinh hoạt cơ bản hằng ngày, bao trùm mua sắm, giáo dục, y tế và giải trí. Hiện đã có nhiều thành phố làm thí điểm.'],
      ['支持者认为，生活圈能够减少通勤时间，缓解交通拥堵，还能增进邻里之间的交流，让城市更有“人情味”。不过也有人担心：在老城区，土地资源有限，配套设施难以一步到位；而在新城区，人口密度不足，商家又缺乏经营动力。', 'Người ủng hộ cho rằng vòng sinh hoạt giúp giảm thời gian đi lại, giảm ùn tắc giao thông, lại tăng giao lưu giữa hàng xóm, khiến thành phố có thêm "tình người". Nhưng cũng có người lo ngại: ở khu phố cũ, quỹ đất có hạn, hạ tầng đi kèm khó hoàn thiện ngay một lúc; còn ở khu đô thị mới, mật độ dân cư thấp, người kinh doanh thiếu động lực.'],
      ['可见，生活圈的建设不能“一刀切”，而应因地制宜：政府需要统筹布局、合理配置资源，同时倾听基层居民的诉求，才能把好事真正落实到位。', 'Có thể thấy, xây dựng vòng sinh hoạt không thể "áp một khuôn", mà phải tùy nơi mà làm: chính quyền cần điều phối, bố cục tổng thể, phân bổ nguồn lực hợp lý, đồng thời lắng nghe nguyện vọng của cư dân cơ sở, thì việc tốt mới thực sự được thực hiện đến nơi đến chốn.'],
    ],
    gl: [['推行', 'tuīxíng', 'triển khai rộng rãi'], ['通勤', 'tōngqín', 'đi lại đi làm hằng ngày'], ['拥堵', 'yōngdǔ', 'ùn tắc'], ['配套设施', 'pèitào shèshī', 'cơ sở hạ tầng đi kèm'], ['一步到位', 'yíbù-dàowèi', 'làm xong ngay một lần'], ['一刀切', 'yìdāoqiē', 'áp dụng một khuôn cứng nhắc'], ['因地制宜', 'yīndì-zhìyí', 'tùy nơi mà làm cho phù hợp']],
    hoi: [
      ['“十五分钟生活圈”指的是？', ['开车十五分钟能到市中心', '步行十五分钟内满足日常需求', '每天运动十五分钟', '十五分钟内买到早点'], 1],
      ['文中提到的担心不包括？', ['老城区土地有限', '新城区人口密度不足', '商家缺乏经营动力', '居民不愿意走路'], 3],
      ['“因地制宜”在文中的意思最接近？', ['根据各地实际情况采取措施', '所有地方采用同一标准', '优先发展新城区', '放弃老城区建设'], 0],
    ],
  },
  {
    id: 'b03', bo: ['国民'], cap: 7, chu_de: 'Thương mại', ten: '一杯越南咖啡的中国之旅', vi_ten: 'Hành trình sang Trung Quốc của một ly cà phê Việt',
    doan: [
      ['走进上海、广州的一些商场，你会发现越南咖啡店越来越多。浓郁的滴漏咖啡、加了炼乳的冰咖啡，再配上一份法棍面包，在年轻白领中逐渐盛行，成了不少人的下午茶选择。', 'Bước vào một số trung tâm thương mại ở Thượng Hải, Quảng Châu, bạn sẽ thấy quán cà phê Việt ngày càng nhiều. Cà phê phin đậm đà, cà phê sữa đá, kèm một ổ bánh mì, đang dần thịnh hành trong giới văn phòng trẻ, thành lựa chọn trà chiều của nhiều người.'],
      ['越南是世界第二大咖啡生产国，以罗布斯塔咖啡豆闻名。这种咖啡豆咖啡因含量高、口感浓烈，价格也相对亲民。近几年，随着中越经贸往来日益密切，加上部分关税下调，越南咖啡通过跨境电商源源不断地进入中国市场。', 'Việt Nam là nước sản xuất cà phê lớn thứ hai thế giới, nổi tiếng với hạt Robusta. Loại hạt này hàm lượng caffeine cao, vị đậm mạnh, giá cũng tương đối bình dân. Mấy năm gần đây, khi quan hệ kinh tế – thương mại Trung – Việt ngày càng chặt chẽ, cộng thêm một số mức thuế quan được hạ, cà phê Việt liên tục vào thị trường Trung Quốc qua thương mại điện tử xuyên biên giới.'],
      ['不过，要在竞争激烈的中国咖啡市场站稳脚跟并不容易。本土品牌凭借低价策略迅速扩张，国际连锁品牌也在不断下沉，还有不少商家借助社交媒体营销，抢占零售市场的份额。越南咖啡要想脱颖而出，除了风味，还需要讲好自己的文化故事。', 'Tuy vậy, đứng vững trên thị trường cà phê Trung Quốc cạnh tranh khốc liệt không hề dễ. Các thương hiệu nội địa mở rộng nhanh nhờ chiến lược giá rẻ, chuỗi quốc tế cũng không ngừng mở xuống các thành phố nhỏ, nhiều người bán còn dùng mạng xã hội để tiếp thị, giành thị phần bán lẻ. Muốn nổi bật, ngoài hương vị, cà phê Việt còn cần kể hay câu chuyện văn hóa của mình.'],
      ['一杯咖啡，承载的不只是味道，还有两国民间交往的温度。', 'Một ly cà phê chở theo không chỉ hương vị, mà còn cả hơi ấm giao lưu giữa người dân hai nước.'],
    ],
    gl: [['浓郁', 'nóngyù', 'đậm đà'], ['滴漏', 'dīlòu', 'nhỏ giọt (pha phin)'], ['炼乳', 'liànrǔ', 'sữa đặc'], ['跨境电商', 'kuàjìng diànshāng', 'TMĐT xuyên biên giới'], ['源源不断', 'yuányuán-búduàn', 'liên tục không dứt'], ['站稳脚跟', 'zhànwěn jiǎogēn', 'đứng vững chân'], ['脱颖而出', 'tuōyǐng\'érchū', 'nổi bật lên']],
    hoi: [
      ['文中提到的越南咖啡饮品是？', ['加炼乳的冰咖啡', '抹茶拿铁', '奶茶', '普洱茶'], 0],
      ['罗布斯塔咖啡豆的特点是？', ['咖啡因含量低', '口感清淡', '咖啡因含量高，口感浓烈', '价格昂贵'], 2],
      ['越南咖啡要在中国脱颖而出，还需要什么？', ['继续降价', '讲好文化故事', '只开在商场里', '放弃跨境电商'], 1],
    ],
  },
  {
    id: 'b04', cap: 7, chu_de: 'Môi trường', ten: '垃圾分类的“最后一公里”', vi_ten: '"Cây số cuối cùng" của phân loại rác',
    doan: [
      ['自从垃圾分类在多个城市全面推行以来，居民的分类意识有了明显提高。然而，在一些小区，经过居民认真分好的垃圾，最后却被混装进同一辆垃圾车。有网民把视频发到网上，此事随即被曝光。不少人感到失望：“我们分了半天，到底有什么用？”', 'Từ khi phân loại rác được triển khai toàn diện ở nhiều thành phố, ý thức phân loại của cư dân đã nâng lên rõ rệt. Thế nhưng ở một số khu dân cư, rác cư dân đã cẩn thận phân loại cuối cùng lại bị đổ lẫn vào cùng một xe rác. Có cư dân mạng đăng video lên mạng, chuyện lập tức bị phanh phui. Nhiều người thất vọng: "Chúng tôi phân loại cả buổi, rốt cuộc có ích gì?"'],
      ['这就是垃圾分类的“最后一公里”问题。分类投放只是第一步，后续的分类收集、运输和处理同样重要。任何一个环节出现脱节，前面的努力都可能白费。', 'Đó chính là vấn đề "cây số cuối cùng" của phân loại rác. Bỏ rác đúng loại chỉ là bước đầu, các khâu thu gom, vận chuyển và xử lý theo loại phía sau cũng quan trọng không kém. Chỉ cần một khâu đứt gãy, mọi nỗ lực trước đó đều có thể uổng phí.'],
      ['为此，一些城市开始为不同类别的垃圾配备专用车辆，并在车上安装定位和监控设备，方便市民监督。还有的地方尝试“积分兑换”制度，居民正确投放可获得积分，用来兑换生活用品。对于混装混运的行为，有关部门也加大了执法力度，依法整顿，并鼓励市民举报。', 'Vì vậy, một số thành phố bắt đầu trang bị xe chuyên dụng cho từng loại rác, gắn thiết bị định vị và giám sát trên xe để người dân tiện theo dõi. Có nơi thử chế độ "đổi điểm": cư dân bỏ rác đúng sẽ được tích điểm để đổi đồ dùng sinh hoạt. Với hành vi thu gom, chở lẫn rác, cơ quan chức năng cũng tăng cường thực thi, chấn chỉnh theo pháp luật và khuyến khích người dân tố giác.'],
      ['垃圾分类是一项系统工程，既需要每个人从身边做起，也离不开政府和企业在整个链条上的协同配合。只有这样，分类才能真正成为生活的常态。', 'Phân loại rác là một công trình mang tính hệ thống, vừa cần mỗi người bắt đầu từ việc nhỏ quanh mình, vừa không thể thiếu sự phối hợp của chính quyền và doanh nghiệp trên toàn bộ chuỗi. Chỉ như vậy, phân loại rác mới thật sự trở thành thói quen thường ngày.'],
    ],
    gl: [['投放', 'tóufàng', 'bỏ (rác) vào'], ['混装', 'hùnzhuāng', 'chất lẫn vào nhau'], ['环节', 'huánjié', 'khâu, mắt xích'], ['脱节', 'tuōjié', 'đứt khúc, rời rạc'], ['白费', 'báifèi', 'uổng phí'], ['兑换', 'duìhuàn', 'đổi lấy'], ['协同', 'xiétóng', 'phối hợp']],
    hoi: [
      ['“最后一公里”问题指的是？', ['居民不愿意分类', '分好的垃圾在后续环节被混装', '垃圾站离小区太远', '垃圾车数量太少'], 1],
      ['下列哪项是文中提到的措施？', ['对居民罚款', '积分兑换', '暂停收垃圾', '提高物业费'], 1],
      ['文章最后强调什么？', ['只靠居民就够了', '需要个人与政府、企业协同配合', '垃圾分类没有意义', '应该取消分类'], 1],
    ],
  },
  {
    id: 'b05', cap: 8, chu_de: 'Giáo dục', ten: '预制菜进校园之争', vi_ten: 'Tranh cãi quanh món ăn chế biến sẵn vào trường học',
    doan: [
      ['去年秋季开学后，“预制菜进校园”的话题在网上引发了激烈讨论，成为舆论关注的焦点。所谓预制菜，是指经过工厂预先加工、到餐厅或食堂只需简单加热即可食用的菜品。', 'Sau khai giảng mùa thu năm ngoái, chủ đề "món chế biến sẵn vào trường học" gây tranh luận gay gắt trên mạng, trở thành tâm điểm của dư luận. Món chế biến sẵn là món ăn được nhà máy sơ chế, chế biến trước, tới nhà hàng hay căng tin chỉ cần hâm nóng là ăn được.'],
      ['赞成者认为，预制菜由中央厨房统一生产，流程标准化，在一定程度上能降低食品安全风险，也能减轻学校食堂的人力负担。反对者则指出，部分预制菜添加剂较多，营养成分在加工和储存过程中有所流失，未必适合正处于生长发育期的孩子。', 'Phía tán thành cho rằng món chế biến sẵn được bếp trung tâm sản xuất thống nhất, quy trình chuẩn hóa, ở mức độ nhất định giảm được rủi ro an toàn thực phẩm và giảm gánh nặng nhân lực cho căng tin. Phía phản đối chỉ ra một số món có nhiều phụ gia, chất dinh dưỡng thất thoát trong quá trình chế biến và bảo quản, chưa chắc phù hợp với trẻ đang tuổi lớn.'],
      ['争论的焦点，归根到底是家长的知情权与选择权。许多家长表示，他们并非一概反对预制菜，而是希望学校主动披露食材来源、加工方式和检测结果，而不是有所隐瞒，让家长吃下“定心丸”。', 'Tâm điểm tranh cãi, suy cho cùng, là quyền được biết và quyền lựa chọn của phụ huynh. Nhiều phụ huynh nói họ không phản đối món chế biến sẵn một cách tuyệt đối, mà mong nhà trường chủ động công bố nguồn nguyên liệu, cách chế biến và kết quả kiểm nghiệm chứ không giấu giếm, để phụ huynh được yên tâm.'],
      ['对此，有专家建议，与其简单地“禁止”或“放开”，不如建立透明的监管机制，让家长委员会参与食堂管理，在效率与健康之间找到平衡点。部分地区的教育部门已作出回应，表示将出台相关准则，防范食品安全风险。', 'Về việc này, có chuyên gia đề xuất: thay vì đơn giản "cấm" hay "thả", nên xây dựng cơ chế giám sát minh bạch, để ban đại diện phụ huynh tham gia quản lý căng tin, tìm điểm cân bằng giữa hiệu quả và sức khỏe. Ngành giáo dục ở một số địa phương đã lên tiếng, cho biết sẽ ban hành chuẩn mực liên quan để phòng ngừa rủi ro an toàn thực phẩm.'],
    ],
    gl: [['预制菜', 'yùzhìcài', 'món ăn chế biến sẵn'], ['添加剂', 'tiānjiājì', 'chất phụ gia'], ['流失', 'liúshī', 'thất thoát, mất đi'], ['一概', 'yígài', 'nhất loạt, hoàn toàn'], ['知情权', 'zhīqíngquán', 'quyền được biết'], ['定心丸', 'dìngxīnwán', 'điều khiến yên tâm'], ['监管', 'jiānguǎn', 'giám sát quản lý']],
    hoi: [
      ['预制菜的特点是？', ['在学校现场制作', '工厂预先加工，简单加热即可食用', '只用新鲜蔬菜', '不含任何添加剂'], 1],
      ['家长争论的焦点是？', ['价格太高', '口味不好', '知情权与选择权', '食堂装修'], 2],
      ['专家的建议是？', ['全面禁止预制菜', '完全放开', '建立透明的监管机制', '让学生自己做饭'], 2],
    ],
  },
  {
    id: 'b06', cap: 8, chu_de: 'Công nghệ', ten: '人工智能会取代翻译吗？', vi_ten: 'Trí tuệ nhân tạo có thay thế người dịch?',
    doan: [
      ['随着大语言模型的迅猛发展，各类翻译引擎的质量已今非昔比。一份几十页的合同，过去需要译员花上几天时间，如今几分钟就能生成初稿。于是，“翻译这个职业还有没有前途”成了许多外语学习者心中的疑问。', 'Cùng với sự phát triển vũ bão của các mô hình ngôn ngữ lớn, chất lượng các công cụ dịch nay đã khác xưa. Một bản hợp đồng vài chục trang, trước kia người dịch mất mấy ngày, nay vài phút đã có bản nháp. Vì thế, "nghề dịch còn tương lai không" trở thành câu hỏi trong lòng nhiều người học ngoại ngữ.'],
      ['不可否认，在技术文档、产品说明等标准化程度较高的领域，机器翻译已经能够胜任大部分工作。但在文学、法律、外交等对语境和分寸要求极高的场合，一个词的偏差就可能造成严重后果，人工的把关依然不可或缺。此外，机器依赖已有的语料学习，难免带有某些文化偏见。', 'Không thể phủ nhận, ở những lĩnh vực có mức chuẩn hóa cao như tài liệu kỹ thuật, hướng dẫn sản phẩm, dịch máy đã đảm đương được phần lớn công việc. Nhưng trong văn học, pháp luật, ngoại giao — nơi đòi hỏi rất cao về ngữ cảnh và chừng mực — chỉ lệch một từ cũng có thể gây hậu quả nghiêm trọng, khâu kiểm duyệt của con người vẫn không thể thiếu. Ngoài ra, máy học từ kho ngữ liệu có sẵn nên khó tránh mang theo một số định kiến văn hóa.'],
      ['更值得关注的是，翻译行业的分工正在发生变化。越来越多的译员从“从零开始翻译”转向“审校与润色”，他们需要具备更资深的专业知识、跨文化理解能力以及对机器错误的敏感度，善于在不同文化之间准确诠释原文的意图。', 'Đáng chú ý hơn, cách phân công trong ngành dịch đang thay đổi. Ngày càng nhiều người dịch chuyển từ "dịch từ đầu" sang "hiệu đính và trau chuốt"; họ cần kiến thức chuyên môn sâu hơn, năng lực hiểu liên văn hóa, độ nhạy với lỗi của máy, và giỏi diễn giải chính xác ý đồ của nguyên bản giữa các nền văn hóa.'],
      ['换言之，被淘汰的不是翻译，而是只会机械转换语言的翻译，这一趋势势必还会延续下去。对于学习者而言，与其焦虑，不如把精力放在机器难以替代的能力上。', 'Nói cách khác, cái bị đào thải không phải nghề dịch, mà là kiểu người dịch chỉ biết chuyển đổi ngôn ngữ một cách máy móc, và xu hướng này chắc chắn còn tiếp diễn. Với người học, thay vì lo âu, hãy dồn sức vào những năng lực mà máy khó thay thế.'],
    ],
    gl: [['迅猛', 'xùnměng', 'mạnh mẽ, vũ bão'], ['今非昔比', 'jīnfēi-xībǐ', 'nay đã khác xưa'], ['胜任', 'shèngrèn', 'đảm đương được'], ['分寸', 'fēncun', 'chừng mực'], ['把关', 'bǎguān', 'kiểm soát, gác cửa'], ['不可或缺', 'bùkě-huòquē', 'không thể thiếu'], ['润色', 'rùnsè', 'trau chuốt câu chữ'], ['淘汰', 'táotài', 'đào thải']],
    hoi: [
      ['机器翻译在哪类领域表现较好？', ['文学', '外交', '技术文档等标准化程度高的领域', '法律'], 2],
      ['译员的工作正在转向什么？', ['审校与润色', '完全失业', '只做口译', '开发翻译软件'], 0],
      ['作者认为学习者应该怎么做？', ['放弃学外语', '完全依靠机器', '培养机器难以替代的能力', '转行做程序员'], 2],
    ],
  },
  {
    id: 'b07', cap: 8, chu_de: 'Kinh tế', ten: '“银发经济”的机遇与乱象', vi_ten: 'Cơ hội và hỗn loạn của "kinh tế bạc"',
    doan: [
      ['中国六十岁及以上的人口已超过三亿。人口老龄化带来的不仅是养老压力，也催生了一个规模庞大的新兴市场——“银发经济”。', 'Dân số từ 60 tuổi trở lên của Trung Quốc đã vượt 300 triệu. Già hóa dân số không chỉ mang lại áp lực dưỡng lão, mà còn làm nảy sinh một thị trường mới quy mô khổng lồ — "kinh tế bạc".'],
      ['与上一代老人相比，如今的老年人受教育程度更高，消费观念也更加开放。他们愿意为旅游、健身、兴趣课程乃至智能设备买单。老年大学一座难求、适老化手机销量攀升，都是这一趋势的缩影。不少企业也开始布局这一领域，拓展适合老年人的产品与服务。', 'So với thế hệ trước, người cao tuổi ngày nay có trình độ học vấn cao hơn, quan niệm tiêu dùng cởi mở hơn. Họ sẵn sàng chi tiền cho du lịch, tập luyện, các lớp sở thích và cả thiết bị thông minh. Trường đại học người cao tuổi khó kiếm chỗ, điện thoại dành cho người già bán chạy — đều là hình ảnh thu nhỏ của xu hướng này. Nhiều doanh nghiệp cũng bắt đầu đón đầu lĩnh vực này, mở rộng sản phẩm và dịch vụ phù hợp với người cao tuổi.'],
      ['不过，银发市场也存在不少乱象。一些商家打着“养生”“保健”的旗号，利用虚假宣传向老人推销价格虚高的产品，有的甚至涉嫌诈骗。专家提醒老年人不要盲目购买，发现问题应及时举报。如何保护老年消费者的合法权益，成为监管部门面临的新课题。', 'Tuy nhiên, thị trường này cũng có không ít hỗn loạn. Một số người bán núp dưới chiêu bài "dưỡng sinh", "chăm sóc sức khỏe" dùng quảng cáo sai sự thật để chào bán sản phẩm giá bị đẩy cao, có kẻ còn bị nghi lừa đảo. Chuyên gia khuyên người cao tuổi đừng mua mù quáng, phát hiện vấn đề cần tố giác kịp thời. Bảo vệ quyền lợi hợp pháp của người tiêu dùng cao tuổi trở thành bài toán mới cho cơ quan quản lý.'],
      ['业内人士认为，银发经济的潜在价值，不在于“把东西卖给老人”，而在于让老年人活得更有尊严、更有质量。只有真正理解老人的需求，企业才能赢得长期的信任。', 'Người trong ngành cho rằng giá trị tiềm tàng của kinh tế bạc không nằm ở "bán được đồ cho người già", mà ở việc giúp người cao tuổi sống có phẩm giá và chất lượng hơn. Chỉ khi thật sự hiểu nhu cầu của họ, doanh nghiệp mới giành được niềm tin lâu dài.'],
    ],
    gl: [['催生', 'cuīshēng', 'thúc đẩy ra đời'], ['买单', 'mǎidān', 'trả tiền, chi cho'], ['一座难求', 'yízuò-nánqiú', 'khó kiếm được một chỗ'], ['攀升', 'pānshēng', 'tăng lên'], ['缩影', 'suōyǐng', 'hình ảnh thu nhỏ'], ['乱象', 'luànxiàng', 'hiện tượng hỗn loạn'], ['旗号', 'qíhào', 'chiêu bài, danh nghĩa'], ['诈骗', 'zhàpiàn', 'lừa đảo']],
    hoi: [
      ['下列哪项体现了老年人消费的新趋势？', ['老年大学一座难求', '年轻人不愿结婚', '房价下降', '出生率上升'], 0],
      ['银发市场的“乱象”是指？', ['产品太便宜', '商家借保健名义推销虚高产品甚至诈骗', '老人不愿消费', '企业太重视老人'], 1],
      ['作者认为银发经济的潜力在于？', ['卖更多保健品', '让老年人活得更有尊严和质量', '提高产品价格', '多开老年大学'], 1],
    ],
  },
  {
    id: 'b08', cap: 8, chu_de: 'Tâm lý', ten: '被短视频“偷走”的注意力', vi_ten: 'Sự tập trung bị video ngắn "đánh cắp"',
    doan: [
      ['“本来只想刷十分钟，结果一抬头两个小时过去了。”相信不少人都有过类似的经历。短视频平台凭借精准的推荐算法，源源不断地推送用户感兴趣的内容，让人欲罢不能。碎片化的资讯和视频片段，悄悄占据了人们大量的时间。', '"Định lướt mười phút thôi, ngẩng lên đã hai tiếng trôi qua." Hẳn nhiều người từng trải qua cảm giác này. Nền tảng video ngắn dựa vào thuật toán đề xuất chính xác, liên tục đẩy những nội dung người dùng quan tâm, khiến người ta muốn dừng mà không dừng được. Những mẩu tin tức và đoạn video vụn vặt lặng lẽ chiếm mất rất nhiều thời gian.'],
      ['心理学研究表明，短视频每隔几秒钟就提供一次新的刺激，大脑会因此不断分泌多巴胺，产生短暂的愉悦感。长此以往，人们对需要长时间专注的事情，如读完一本书、听完一节课，会越来越缺乏耐心。有人甚至发现，自己连把视线从屏幕上移开都需要很强的意志力。', 'Nghiên cứu tâm lý cho thấy video ngắn cứ vài giây lại tạo một kích thích mới, não vì thế liên tục tiết dopamine, sinh cảm giác vui thích ngắn ngủi. Lâu dần, con người ngày càng thiếu kiên nhẫn với những việc cần tập trung dài, như đọc hết một cuốn sách hay nghe trọn một buổi học. Có người còn nhận ra, chỉ việc rời mắt khỏi màn hình thôi cũng cần ý chí rất lớn.'],
      ['当然，把问题全部归咎于短视频也有失公允。短视频降低了知识传播的门槛，许多人正是通过它学会了做饭、修电器，甚至学外语。关键在于使用者能否掌握主动权。', 'Tất nhiên, đổ hết lỗi cho video ngắn cũng thiếu công bằng. Video ngắn hạ thấp ngưỡng lan truyền tri thức; nhiều người học nấu ăn, sửa đồ điện, thậm chí học ngoại ngữ nhờ nó. Mấu chốt là người dùng có nắm được quyền chủ động hay không.'],
      ['一些人开始尝试“数字断舍离”：关闭推送通知、设置使用时限，或者每周安排一天不碰手机，以此抵制无休止的诱惑。与其被算法牵着鼻子走，不如重新做自己时间的主人。', 'Một số người bắt đầu thử "buông bỏ kỹ thuật số": tắt thông báo, đặt giới hạn thời gian dùng, hoặc mỗi tuần dành một ngày không chạm điện thoại, để cưỡng lại những cám dỗ không hồi kết. Thay vì bị thuật toán dắt mũi, hãy làm chủ lại thời gian của mình.'],
    ],
    gl: [['算法', 'suànfǎ', 'thuật toán'], ['欲罢不能', 'yùbà-bùnéng', 'muốn dừng mà không dừng được'], ['分泌', 'fēnmì', 'tiết ra'], ['多巴胺', 'duōbā\'àn', 'dopamine'], ['归咎', 'guījiù', 'đổ lỗi cho'], ['有失公允', 'yǒushī gōngyǔn', 'thiếu công bằng'], ['门槛', 'ménkǎn', 'ngưỡng cửa, rào cản'], ['牵着鼻子走', 'qiānzhe bízi zǒu', 'bị dắt mũi']],
    hoi: [
      ['短视频让人“欲罢不能”的原因是？', ['内容都很长', '推荐算法精准，不断推送感兴趣的内容', '需要付费才能看', '没有广告'], 1],
      ['长期刷短视频可能导致？', ['更加专注', '对需要长时间专注的事缺乏耐心', '记忆力提高', '不再分泌多巴胺'], 1],
      ['作者对短视频的态度是？', ['完全否定', '完全肯定', '关键在于使用者掌握主动权', '应该立刻禁止'], 2],
    ],
  },
  {
    id: 'b09', cap: 8, chu_de: 'Sức khỏe', ten: '睡不好觉催生的“睡眠经济”', vi_ten: '"Kinh tế giấc ngủ" sinh ra từ những đêm mất ngủ',
    doan: [
      ['一些调查显示，相当一部分中国成年人存在不同程度的睡眠问题。熬夜加班、睡前刷手机、精神压力大，让“睡个好觉”成了一种奢侈。', 'Một số khảo sát cho thấy khá nhiều người trưởng thành ở Trung Quốc gặp vấn đề về giấc ngủ ở các mức độ khác nhau. Thức khuya tăng ca, lướt điện thoại trước khi ngủ, áp lực tinh thần lớn khiến "ngủ một giấc ngon" trở thành điều xa xỉ.'],
      ['巨大的需求催生了蓬勃发展的“睡眠经济”。从助眠枕头、遮光窗帘，到白噪音应用、智能手环，商家推出了五花八门的产品。一些城市甚至出现了按小时收费的“午睡舱”，专门为写字楼里的上班族提供短暂的休息空间。', 'Nhu cầu khổng lồ đã làm "kinh tế giấc ngủ" phát triển rầm rộ. Từ gối hỗ trợ giấc ngủ, rèm chắn sáng, đến ứng dụng tiếng ồn trắng, vòng đeo tay thông minh — người bán tung ra đủ loại sản phẩm. Một số thành phố còn có "khoang ngủ trưa" tính tiền theo giờ, chuyên cho dân văn phòng nghỉ ngắn.'],
      ['不过，医生提醒，大多数助眠产品只能起到辅助作用，无法从根本上解决失眠问题。有些产品夸大功效，靠营销制造焦虑，消费者不宜盲目跟风。长期失眠可能与焦虑、抑郁等心理因素有关，应及时就医，而不是寄希望于一款“神奇”的产品。临床上已有较成熟的疗法；一旦出现病情恶化的迹象，更应尽早治疗。', 'Tuy nhiên, bác sĩ lưu ý phần lớn sản phẩm hỗ trợ giấc ngủ chỉ có tác dụng phụ trợ, không giải quyết tận gốc chứng mất ngủ. Một số sản phẩm thổi phồng công dụng, dựa vào tiếp thị để gieo lo âu, người mua không nên chạy theo mù quáng. Mất ngủ kéo dài có thể liên quan tới lo âu, trầm cảm và các yếu tố tâm lý khác, nên đi khám kịp thời thay vì đặt hy vọng vào một sản phẩm "thần kỳ". Trên lâm sàng đã có những liệu pháp khá hoàn chỉnh; hễ có dấu hiệu bệnh nặng thêm thì càng phải điều trị sớm.'],
      ['说到底，最好的“助眠神器”或许是规律的作息：按时睡觉、睡前远离电子屏幕、白天适量运动。这些方法虽然不花钱，却往往比昂贵的产品更有效。', 'Nói cho cùng, "bảo bối ngủ ngon" tốt nhất có lẽ là giờ giấc điều độ: ngủ đúng giờ, tránh màn hình trước khi ngủ, ban ngày vận động vừa phải. Những cách này tuy không tốn tiền nhưng thường hiệu quả hơn sản phẩm đắt đỏ.'],
    ],
    gl: [['熬夜', 'áoyè', 'thức khuya'], ['奢侈', 'shēchǐ', 'xa xỉ'], ['蓬勃', 'péngbó', 'phát triển mạnh mẽ'], ['五花八门', 'wǔhuā-bāmén', 'muôn hình muôn vẻ'], ['辅助', 'fǔzhù', 'phụ trợ'], ['抑郁', 'yìyù', 'trầm cảm, u uất'], ['作息', 'zuòxī', 'giờ giấc sinh hoạt']],
    hoi: [
      ['下列哪项不是文中提到的助眠产品？', ['遮光窗帘', '白噪音应用', '午睡舱', '安眠药'], 3],
      ['医生提醒了什么？', ['助眠产品能根治失眠', '长期失眠应及时就医', '应该多买助眠产品', '午睡对身体有害'], 1],
      ['作者认为最好的“助眠神器”是？', ['智能手环', '昂贵的枕头', '规律的作息', '白噪音'], 2],
    ],
  },
  {
    id: 'b10', bo: ['流水'], cap: 9, chu_de: 'Văn hóa', ten: '非遗传承人的守与变', vi_ten: 'Giữ và đổi của người truyền thừa di sản phi vật thể',
    doan: [
      ['在贵州的一个苗族村寨里，年过七旬的老人依然每天坐在窗前，一针一线地绣出精美的图案。她出身刺绣世家，早年收过十几个弟子，如今大多已经改行。作为当地苗绣技艺的非物质文化遗产传承人，然而让她忧心忡忡的是：村里的年轻人大多外出打工，愿意坐下来学刺绣的人寥寥无几。', 'Ở một bản người Miêu tại Quý Châu, bà cụ ngoài bảy mươi vẫn ngày ngày ngồi bên cửa sổ, từng mũi kim thêu nên những hoa văn tinh xảo. Bà xuất thân từ gia đình nhiều đời làm thêu, từng nhận hơn chục đệ tử, nay phần lớn đã đổi nghề. Là người truyền thừa di sản văn hóa phi vật thể nghề thêu Miêu ở địa phương, điều khiến bà lo lắng không yên là: thanh niên trong bản phần lớn đi làm ăn xa, người chịu ngồi xuống học thêu chẳng được mấy ai.'],
      ['这并非个例。许多传统技艺学习周期长、收入微薄，难以吸引年轻一代。一旦老一辈传承人离世，一些技艺便可能面临失传的危险。', 'Đây không phải trường hợp cá biệt. Nhiều nghề truyền thống học lâu, thu nhập ít ỏi, khó thu hút thế hệ trẻ. Một khi lớp người truyền thừa đi trước qua đời, một số nghề có thể đứng trước nguy cơ thất truyền.'],
      ['近年来，“非遗+文创”“非遗+直播”等模式为传统技艺注入了新的活力，当地政府也出台政策扶持传统手工艺，助力乡村振兴。一些年轻手艺人通过短视频展示制作过程，把产品卖到了全国各地，甚至海外。但也有学者提醒，过度商业化可能导致技艺被简化、意义被稀释，“活态传承”不应变成“流水线生产”。', 'Những năm gần đây, các mô hình "di sản + sáng tạo văn hóa", "di sản + livestream" đã thổi sức sống mới cho nghề truyền thống; chính quyền địa phương cũng ban hành chính sách hỗ trợ thủ công truyền thống, góp sức chấn hưng nông thôn. Một số nghệ nhân trẻ quay video ngắn quá trình làm, bán sản phẩm khắp cả nước, thậm chí ra nước ngoài. Nhưng cũng có học giả nhắc nhở: thương mại hóa quá mức có thể khiến kỹ nghệ bị giản lược, ý nghĩa bị pha loãng; "truyền thừa sống" không nên biến thành "sản xuất dây chuyền".'],
      ['如何在保护与开发之间拿捏分寸，让非遗既“活下去”又“传下去”，考验着每一位守护者的智慧。', 'Làm sao giữ được chừng mực giữa bảo tồn và khai thác, để di sản vừa "sống tiếp" vừa "truyền tiếp", là phép thử trí tuệ của mỗi người gìn giữ di sản.'],
    ],
    gl: [['非物质文化遗产', 'fēi wùzhì wénhuà yíchǎn', 'di sản văn hóa phi vật thể'], ['传承人', 'chuánchéngrén', 'người truyền thừa'], ['忧心忡忡', 'yōuxīn-chōngchōng', 'lo lắng không yên'], ['寥寥无几', 'liáoliáo-wújǐ', 'lèo tèo chẳng mấy'], ['微薄', 'wēibó', 'ít ỏi'], ['失传', 'shīchuán', 'thất truyền'], ['稀释', 'xīshì', 'pha loãng'], ['拿捏分寸', 'náriē fēncun', 'nắm đúng chừng mực']],
    hoi: [
      ['老人最担忧的是什么？', ['刺绣卖不出去', '年轻人不愿学刺绣', '身体越来越差', '没有好的布料'], 1],
      ['学者提醒的风险是？', ['直播技术太难', '过度商业化使技艺被简化、意义被稀释', '海外市场太小', '学刺绣的年轻人太多'], 1],
      ['“拿捏分寸”在文中的意思是？', ['准确把握适当的程度', '测量布料尺寸', '放弃商业开发', '加快生产速度'], 0],
    ],
  },
  {
    id: 'b11', bo: ['人选'], cap: 9, chu_de: 'Xã hội', ten: '在“内卷”与“躺平”之间', vi_ten: 'Giữa "cuốn vào trong" và "nằm thẳng"',
    doan: [
      ['在当下的网络语境中，“内卷”和“躺平”几乎成了描述年轻人生存状态的两个关键词，在舆论场上引发了持续讨论。前者指在资源有限的情况下，人们为了争夺有限的机会而过度竞争，付出越来越多，回报却并未增加；后者则是对这种竞争的消极回应——既然拼不赢，干脆不拼了。', 'Trong ngữ cảnh mạng hiện nay, "nội quyển" và "nằm thẳng" gần như thành hai từ khóa mô tả trạng thái sống của giới trẻ, gây bàn luận không dứt trong dư luận. Từ trước chỉ việc khi nguồn lực có hạn, người ta cạnh tranh quá mức để giành những cơ hội ít ỏi, bỏ ra ngày càng nhiều mà thu về không tăng; từ sau là phản ứng tiêu cực với cuộc cạnh tranh ấy — đã đua không thắng thì thôi không đua nữa.'],
      ['表面上看，二者截然相反，实则一体两面：正是“卷”不动了，才有人选择“躺”。有社会学者认为，这一现象折射出部分年轻人在住房、就业、教育等方面所承受的压力，以及对个人努力能否实现阶层流动的怀疑。', 'Nhìn bề ngoài, hai điều hoàn toàn trái ngược, thực ra là hai mặt của một vấn đề: chính vì "cuốn" không nổi nữa nên mới có người chọn "nằm". Có nhà xã hội học cho rằng hiện tượng này phản chiếu áp lực một bộ phận người trẻ gánh chịu về nhà ở, việc làm, giáo dục, cùng sự hoài nghi liệu nỗ lực cá nhân có giúp dịch chuyển tầng lớp hay không.'],
      ['然而，将“躺平”简单理解为懒惰，未免失之偏颇。在不少人看来，它更多是一种对单一成功标准的反思：人生不必只有升职加薪一条路，降低物欲、关注内心，同样是一种选择。这也折射出年轻一代价值观的变化。', 'Tuy nhiên, hiểu "nằm thẳng" đơn giản là lười biếng thì e là phiến diện. Với nhiều người, đó nhiều hơn là sự suy ngẫm về một thước đo thành công duy nhất: đời người không nhất thiết chỉ có con đường thăng chức tăng lương; giảm ham muốn vật chất, chú tâm vào nội tâm cũng là một lựa chọn. Điều đó cũng phản chiếu sự thay đổi giá trị quan của thế hệ trẻ.'],
      ['与其在“卷”与“躺”之间二选一，不如寻找第三条路：在力所能及的范围内努力，同时守住生活的边界。社会也应当更加包容，正视年轻人的合理诉求，提供更多元的评价体系，让不同的选择都能得到尊重。', 'Thay vì chọn một trong hai "cuốn" hoặc "nằm", hãy tìm con đường thứ ba: nỗ lực trong khả năng của mình, đồng thời giữ vững ranh giới của cuộc sống. Xã hội cũng nên bao dung hơn, nhìn thẳng vào những nguyện vọng chính đáng của người trẻ, có hệ thống đánh giá đa dạng hơn, để những lựa chọn khác nhau đều được tôn trọng.'],
    ],
    gl: [['内卷', 'nèijuǎn', 'cạnh tranh nội bộ quá mức'], ['躺平', 'tǎngpíng', 'nằm thẳng, buông xuôi'], ['截然相反', 'jiérán xiāngfǎn', 'hoàn toàn trái ngược'], ['一体两面', 'yìtǐ liǎngmiàn', 'hai mặt của một vấn đề'], ['折射', 'zhéshè', 'phản chiếu'], ['失之偏颇', 'shīzhī piānpō', 'thiên lệch, phiến diện'], ['物欲', 'wùyù', 'ham muốn vật chất'], ['力所能及', 'lìsuǒnéngjí', 'trong khả năng của mình']],
    hoi: [
      ['“内卷”指的是？', ['主动放弃竞争', '资源有限时过度竞争，回报却未增加', '经济快速增长', '年轻人出国留学'], 1],
      ['社会学者认为这一现象折射出什么？', ['年轻人天生懒惰', '年轻人承受的压力和对上升空间的怀疑', '社会资源过剩', '教育质量下降'], 1],
      ['作者主张什么？', ['必须选择“卷”', '必须选择“躺”', '寻找第三条路，并建立多元评价体系', '取消一切竞争'], 2],
    ],
  },
  {
    id: 'b12', cap: 9, chu_de: 'Nghị luận', ten: '再谈“读书无用论”', vi_ten: 'Bàn lại "thuyết học hành vô dụng"',
    doan: [
      ['每到毕业季，“读书无用论”总会被重新提起：有人寒窗苦读十余年，毕业后却找不到理想的工作；有人早早辍学创业，反而事业有成。于是，“读书到底有没有用”成了一个反复被追问的问题。', 'Cứ đến mùa tốt nghiệp, "thuyết học hành vô dụng" lại được nhắc tới: có người dùi mài kinh sử hơn mười năm, tốt nghiệp xong lại không tìm được việc như ý; có người bỏ học sớm khởi nghiệp, ngược lại thành đạt. Thế là "học rốt cuộc có ích không" thành câu hỏi bị truy vấn đi truy vấn lại.'],
      ['这种论调的问题在于，它把“读书”狭隘地等同于“获得文凭”，又把“有用”简单地等同于“赚钱”。事实上，个别案例并不能推翻整体规律，这种以偏概全的论证方式显然站不住脚。大量统计数据表明，受教育程度与收入水平、职业稳定性总体上呈正相关。', 'Vấn đề của luận điệu này là nó đánh đồng một cách hẹp hòi "học" với "lấy bằng", lại đơn giản đồng nhất "có ích" với "kiếm tiền". Thực tế, vài trường hợp cá biệt không thể lật đổ quy luật chung; cách lập luận lấy một phần thay toàn bộ như vậy rõ ràng không đứng vững. Nhiều số liệu thống kê cho thấy trình độ học vấn nhìn chung có tương quan thuận với mức thu nhập và sự ổn định nghề nghiệp.'],
      ['更重要的是，读书的价值远不止于谋生。它塑造一个人的思维方式，拓宽视野、增长见识，使人在面对复杂问题时能够独立判断，而不是人云亦云。这些能力难以量化，却会在人生的关键时刻发挥作用。', 'Quan trọng hơn, giá trị của việc học vượt xa chuyện mưu sinh. Nó định hình cách tư duy, mở rộng tầm nhìn, tăng thêm hiểu biết, giúp con người tự phán đoán khi đối mặt vấn đề phức tạp thay vì ăn theo nói leo. Những năng lực này khó định lượng nhưng sẽ phát huy tác dụng vào những thời khắc then chốt của đời người.'],
      ['固然，我们也应实事求是地正视教育与社会需求脱节的现实，从根源上推动教育改革，改变以应试为导向的做法，让所学更好地服务于所用。但无论如何，因噎废食地否定读书本身，显然是不可取的。', 'Dĩ nhiên, chúng ta cũng cần thực sự cầu thị, nhìn thẳng vào thực tế giáo dục còn lệch với nhu cầu xã hội, cải cách giáo dục từ gốc rễ, thay đổi lối dạy lấy thi cử làm định hướng, để điều học được phục vụ tốt hơn cho điều cần dùng. Nhưng dù thế nào, vì nghẹn mà bỏ ăn, phủ nhận chính việc học, rõ ràng là không nên.'],
    ],
    gl: [['寒窗苦读', 'hánchuāng kǔdú', 'dùi mài kinh sử'], ['辍学', 'chuòxué', 'bỏ học'], ['论调', 'lùndiào', 'luận điệu'], ['狭隘', 'xiá\'ài', 'hẹp hòi'], ['正相关', 'zhèng xiāngguān', 'tương quan thuận'], ['人云亦云', 'rényún-yìyún', 'ăn theo nói leo'], ['量化', 'liànghuà', 'định lượng'], ['因噎废食', 'yīnyē-fèishí', 'vì nghẹn mà bỏ ăn']],
    hoi: [
      ['作者认为“读书无用论”的问题在于？', ['统计数据太多', '把读书等同于文凭，把有用等同于赚钱', '忽视了创业的风险', '太重视理论知识'], 1],
      ['根据文章，读书的价值包括？', ['只是为了找工作', '塑造思维方式，帮助独立判断', '保证一定能赚大钱', '让人人云亦云'], 1],
      ['“因噎废食”在文中比喻什么？', ['因为有小问题就全盘否定', '吃饭太快', '节约粮食', '重视健康饮食'], 0],
    ],
  },
];
