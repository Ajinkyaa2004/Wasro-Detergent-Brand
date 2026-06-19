export type Distributor = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
};

export const STATES = [
  "Assam",
  "Meghalaya",
  "Manipur",
  "Tripura",
  "Mizoram",
  "Nagaland",
  "Arunachal Pradesh",
  "West Bengal",
  "Bihar",
  "Odisha",
] as const;

export const DISTRIBUTORS: Distributor[] = [
  // ---- Assam ----
  { id: "abhishek-9th-mile", name: "Abhishek General Store - 9th Mile", address: "9th Mile, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "7896883280" },
  { id: "adinath-dibrugarh", name: "Adinath Traders - Dibrugarh", address: "Cole Road, Dibrugarh", city: "Dibrugarh", state: "Assam", phone: "9435030363" },
  { id: "ahaana-sixmile", name: "Ahaana Bazaar - Sixmile", address: "VIP Road, Amtol Sixmile, Guwahati, Kamrup Metropolitan", city: "Guwahati", state: "Assam", phone: "8826049990" },
  { id: "ajay-jagiroad", name: "Ajay Ajmera - Jagiroad", address: "Jagiroad, Assam, 782410", city: "Jagiroad", state: "Assam", phone: "9395746269" },
  { id: "amrit-biharbari", name: "Amrit Bhandar - Biharbari", address: "NH 37, Borsajai Gaon, Garbhanga, Kamrup Metropolitan, Assam", city: "Garbhanga", state: "Assam", phone: "9435191245" },
  { id: "amulapatty-ezzybazar", name: "Amulapatty Trading Pvt Ltd - Ezzybazar", address: "Six Mile, Guwahati, Assam-781022", city: "Guwahati", state: "Assam", phone: "9101236006" },
  { id: "anurag-barpeta", name: "Anurag Agencies - Barpeta", address: "Barpeta Road, Assam", city: "Barpeta", state: "Assam", phone: "9864917347" },
  { id: "ayansh-abc", name: "Ayansh Store - ABC", address: "ABC, Guwahati", city: "Guwahati", state: "Assam", phone: "9085940436" },
  { id: "balajee-kharupetia", name: "Balajee Traders - Kharupetia", address: "Kharupetia, Darrang, Assam- 784114", city: "Kharupetia", state: "Assam", phone: "9435088081" },
  { id: "barman-brothers", name: "Barman Brothers", address: "Barbari, Near Soni Mandir, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "9864505030" },
  { id: "bothra-silchar", name: "Bothra Brothers - Silchar", address: "Gopal Market, Gopalganj, Silchar, Cachar, Assam", city: "Silchar", state: "Assam", phone: "9435074481" },
  { id: "d-enterprises-fancy", name: "D. Enterprises - Fancy Bazar", address: "T.R.P Road Krishna Bhawan, Fancy Bazar, Guwahati 781001", city: "Guwahati", state: "Assam", phone: "9101376807" },
  { id: "evergreen-tinsukia", name: "Evergreen Traders - Tinsukia", address: "Saiding Bazar, Tinsukia, Assam, 786125", city: "Tinsukia", state: "Assam", phone: "9954457040" },
  { id: "gk-goalpara", name: "G.K. Enterprise - Goalpara", address: "Pancharatna Road, Near Canara Bank, New Market, Goalpara, Assam, 783101", city: "Goalpara", state: "Assam", phone: "7002310566" },
  { id: "glass-plywood-home", name: "Glass and Plywood Home", address: "525/G2, G S Road, Ganeshguri Charialli, Dispur, Guwahati, Assam, 781005", city: "Guwahati", state: "Assam", phone: "9706077655" },
  { id: "guwahati-refiner-noonmati", name: "Guwahati Refiner Employ Co-Op Society - Noonmati", address: "Sonali Bhawan, Noonmati, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "6001846720" },
  { id: "hardware-house", name: "Hardware House", address: "54A, H B Road, Fancy Bazar, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "8876519883" },
  { id: "jk-morigaon", name: "J K Store - Morigaon", address: "Vill Mac Hakhoba Jaluguti, Morigaon", city: "Morigaon", state: "Assam", phone: "7002330264" },
  { id: "jd-kedar", name: "J.D. Enterprise - Kedar Road", address: "M G Road, Fancy Bazar, Guwahati", city: "Guwahati", state: "Assam", phone: "9854080351" },
  { id: "jl-kedar", name: "J.L. Enterprise - Kedar Road", address: "Mani Bhawan, Kedar Road, Guwahati", city: "Guwahati", state: "Assam", phone: "9435145917" },
  { id: "jai-hanuman-9th", name: "Jai Hanuman Store - 9th Mile", address: "9th Mile, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "9954906228" },
  { id: "jai-hanuman-dergaon", name: "Jai Hanuman Traders - Dergaon", address: "Ward No 7, PHCG Path, Dergaon, Golaghat", city: "Dergaon", state: "Assam", phone: "9435096555" },
  { id: "jai-mata-srinagar", name: "Jai Mata Di Enterprise - Srinagar", address: "Srinagar, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "6003484042" },
  { id: "jain-grains", name: "Jain Grains", address: "3rd Floor, Shanti Bhawan, TRP Road, Fancy Bazar, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "9089665660" },
  { id: "jain-tihu", name: "Jain Store - Tihu", address: "Nathkuchi No 1, Tihu, Nalbari, Assam", city: "Tihu", state: "Assam", phone: "7099754077" },
  { id: "jat-brothers", name: "Jat Brothers", address: "Wet Canteen, 222 ABOD, Guwahati, Kamrup Metropolitan", city: "Guwahati", state: "Assam", phone: "9435903581" },
  { id: "jay-deep-kedar", name: "Jay Deep Enterprises - Kedar Road", address: "Kedar Road, Machkhowa, Kamrup Metropolitan", city: "Guwahati", state: "Assam", phone: "7002824779" },
  { id: "kamakhya-dispur", name: "Kamakhya Enterprise - Dispur", address: "Radhanagar, Dispur, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "9531142927" },
  { id: "kamakhya-satgaon", name: "Kamakhya Store - Satgaon", address: "01, Satgaon Road, Satgaon Bazar, Guwahati, Assam, 781027", city: "Guwahati", state: "Assam", phone: "9435117812" },
  { id: "kamala-changsari", name: "Kamala Jee Fooding & Lodging - Changsari", address: "Changsari, Nizsindurighopa, Kamrup, Assam, 781101", city: "Changsari", state: "Assam", phone: "8471934344" },
  { id: "khetan-bokakhat", name: "Khetan Store - Bokakhat", address: "Bokakhat, A.T. Road, Golaghat, Assam, 785612", city: "Bokakhat", state: "Assam", phone: "8761834788" },
  { id: "mm-store", name: "M M Store", address: "Basistha, Natun Bazar, Basistha Main Road, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "8876495817" },
  { id: "m-prasad-ulubari", name: "M. Prasad - Ulubari", address: "Opp. Kanhas, Ulubari, Guwahati", city: "Guwahati", state: "Assam", phone: "8011872642" },
  { id: "m-alam-garchuk", name: "M. Alam Store - Garchuk", address: "Garchuk Charali, Guwahati", city: "Guwahati", state: "Assam", phone: "9394631956" },
  { id: "amarchand-ladohigarh", name: "M/S Amarchand Sharma & Co. - Ladohigarh", address: "Bam Dhekiakhowa, A.T. Road, Lahdoigarh, Jorhat", city: "Lahdoigarh", state: "Assam", phone: "8638265554" },
  { id: "assam-tea-fancy", name: "M/S Assam Tea Co. - Fancy Bazar", address: "S.R.C.B. Road, Fancy Bazar, Guwahati, Assam, 781001", city: "Guwahati", state: "Assam", phone: "9706039099" },
  { id: "bansidhar-sarupathar", name: "M/s Bansidhar Agarwalla - Sarupathar", address: "Thana Road, Opposite Railway Station, Sarupathar, Golaghat 785601", city: "Sarupathar", state: "Assam", phone: "9678912508" },
  { id: "cs-fancy", name: "M/s C S Enterprises - Fancy Bazar", address: "Radha Rani Market, T.R. Phookan Road, Fancy Bazar, Guwahati, Assam, 781001", city: "Guwahati", state: "Assam", phone: "7635989641" },
  { id: "durga-krishnai", name: "M/S Durga Stores - Krishnai", address: "Main Bazar, Krishnai, Goalpara", city: "Krishnai", state: "Assam", phone: "9435721644" },
  { id: "easy-mega-sixmile", name: "M/S Easy Mega Mart - Sixmile", address: "Piya Plaza II, VIP Road, Sixmile, Orbari Charialli, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "8099001932" },
  { id: "ganpati-beltola", name: "M/S Ganpati Bhandar - Beltola", address: "Opp. SBI, Boltola Branch, Baisistha Road, Beltola, Guwahati, Assam, 781029", city: "Guwahati", state: "Assam", phone: "7002156870" },
  { id: "giriraj-satgaon", name: "M/S Giriraj Store - Satgaon", address: "Goswami Colony, Udayan Vihar, Sathgaon Road, Guwahati, Assam, 781171", city: "Guwahati", state: "Assam", phone: "9602269180" },
  { id: "gopal-krishnai", name: "M/S Gopal Store - Krishnai", address: "Krishnai Bazar, Goalpara", city: "Krishnai", state: "Assam", phone: "8638722436" },
  { id: "kamakhya-bhander-krishnai", name: "M/S Kamakhya Bhander - Krishnai", address: "Main Road, P.O. Krishnai, Goalpara", city: "Krishnai", state: "Assam", phone: "6003192100" },
  { id: "kapoor-nalbari", name: "M/s Kapoor Chand Dharam Chand - Nalbari", address: "9A, B P Road, Nalbari, Assam, 781335", city: "Nalbari", state: "Assam", phone: "9435726064" },
  { id: "lokenath-rangapara", name: "M/S Lokenath Enterprise - Rangapara", address: "M.G. Road, Rangapara, Sonitpur", city: "Rangapara", state: "Assam", phone: "9435467764" },
  { id: "maa-basistha", name: "M/S Maa Store - Basistha", address: "Near A.G. Stoppage, Baisitha, Guwahati", city: "Guwahati", state: "Assam", phone: "8638506609" },
  { id: "mahak-dibrugarh", name: "M/S Mahak Agencies - Dibrugarh", address: "K.P. Road, West Chowkidinghee, Dibrugarh, Assam", city: "Dibrugarh", state: "Assam", phone: "9435476343" },
  { id: "manmal-sivsagar", name: "M/S Manmal Sundarlal (MSL) - Sivsagar", address: "412, Main Road, Sonari, Sivasagar, Assam, 785690", city: "Sivasagar", state: "Assam", phone: "7086724402" },
  { id: "moolchand-nalbari", name: "M/s Moolchand Chiranjilal - Nalbari", address: "18, Bhakatpara Road, Nalbari", city: "Nalbari", state: "Assam", phone: "9435027432" },
  { id: "parashnath-dhubri", name: "M/S Parashnath Trading - Dhubri", address: "W/No-5, B.N. Bose Road, Dhubri, Assam, 783301", city: "Dhubri", state: "Assam", phone: "7002300329" },
  { id: "prakash-krishnai", name: "M/S Prakash Enterprise - Krishnai", address: "Krishnai, Goalpara", city: "Krishnai", state: "Assam", phone: "8638667737" },
  { id: "roy-krishnai", name: "M/S Roy Enterprise Krishnai", address: "Own Premise, Krishnai Bazar, P.O. Krishnai, Goalpara", city: "Krishnai", state: "Assam", phone: "9435721594" },
  { id: "sima-rangia", name: "M/S Sima Store - Rangia", address: "Room No-3, Public Bus Stand, Rangia, Kamrup, Assam", city: "Rangia", state: "Assam", phone: "7002275053" },
  { id: "tc-exports-dibrugarh", name: "M/S TC Exports - Dibrugarh", address: "269, Shankar Bhandar Building, New Market Road, Dibrugarh, Assam, 786001", city: "Dibrugarh", state: "Assam", phone: "9435256225" },
  { id: "usha-fancy", name: "M/s Usha Trading - Fancy Bazar", address: "1, Oswal Complex, Kamrup Chamber Road, Fancy Bazar, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "9957804317" },
  { id: "hanuman-krishnai", name: "M/S Hanuman Store - Krishnai", address: "Goalpara, Krishnai, Haje Akkas Ali Lane", city: "Krishnai", state: "Assam", phone: "9957698991" },
  { id: "madina-krishnai", name: "M/S Madina Store - Krishnai", address: "Krishnai Samabay Samittee, Krishnai Bazar, Goalpara", city: "Krishnai", state: "Assam", phone: "8822182463" },
  { id: "padmawati-silchar", name: "Maa Padmawati Traders - Silchar", address: "242, Kali Bari Road, Near Sadar Thana, Silchar", city: "Silchar", state: "Assam", phone: "9101437504" },
  { id: "madras-satgaon", name: "Madras Store - Satgaon", address: "Old SBI Building, Satgaon Bazar, Guwahati, Assam, 781171", city: "Guwahati", state: "Assam", phone: "9957543085" },
  { id: "mahabali", name: "Mahabali Enterprise", address: "Opp Municipality Market, M.S. Road, Fancy Bazar, Guwahati, Assam, 781001", city: "Guwahati", state: "Assam", phone: "9435731574" },
  { id: "mahabir-dhekiajuli", name: "Mahabir Prasad Mahender Kumar - Dhekiajuli", address: "Ward No. 9, Main Road, Dhekiajuli, Assam- 784110", city: "Dhekiajuli", state: "Assam", phone: "9435937628" },
  { id: "manasee-lakhimpur", name: "Manasee Enterprise - Lakhimpur", address: "Ground Floor, NH 15, Khelmati, North Lakhimpur, Lakhimpur", city: "Lakhimpur", state: "Assam", phone: "9954372595" },
  { id: "maya-fancy", name: "Maya Enterprises (Pradeep) - Fancy Bazar", address: "Baruah Market, Fancy Bazar, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "9435019015" },
  { id: "mk-sundarpur", name: "MK Enterprise / Quick Shopee - Sundarpur", address: "NRL Petrolpump, Sundarpur, RGB Road, Guwahati", city: "Guwahati", state: "Assam", phone: "9706044674" },
  { id: "moolchand-dibrugarh", name: "Moolchand Manoj Kumar Jain - Dibrugarh", address: "Kayal Building, Cole Road, Dibrugarh, Assam, 786001", city: "Dibrugarh", state: "Assam", phone: "9435033797" },
  { id: "m-store-satgaon", name: "M-Store - Satgaon", address: "Satgaon, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "6001126252" },
  { id: "namo-panbazar", name: "Namo Drugs and Surgicals - Panbazar", address: "Aziz Complex, SC Goswami Road, Hari Sabha, Pan Bazar, Guwahati", city: "Guwahati", state: "Assam", phone: "9774184472" },
  { id: "nirmal-silchar", name: "Nirmal Trading Co. - Silchar", address: "Opp. GMC Building, Lakhipur Road, Silchar, Cachar, Assam", city: "Silchar", state: "Assam", phone: "9435893143" },
  { id: "nirmal-karimganj", name: "Nirmal Trading Company - Karimganj", address: "East Bazar, P.O. Karimganj", city: "Karimganj", state: "Assam", phone: "9435074923" },
  { id: "odc-uzanbazar", name: "ODC (Over-D-Counter) - Uzan Bazar", address: "M.G. Road, Uzanbazar, Guwahati, Assam, 781001", city: "Guwahati", state: "Assam", phone: "9854387703" },
  { id: "pawan-rangia", name: "Pawan Store - Rangia", address: "Near Petrol Pump, Rangia Road, Baihata Chariali, Kamrup", city: "Baihata Chariali", state: "Assam", phone: "9864340116" },
  { id: "pearl-jorhat", name: "Pearl Industries - Jorhat", address: "AT Road, Gohain Tekela Gaon, Kenduguri, Jorhat, Assam, 785001", city: "Jorhat", state: "Assam", phone: "9602365441" },
  { id: "poddar-peoples", name: "Poddar Retails - People's Mart", address: "RCC Building, Dwarandha, Guwahati, Assam, 781005", city: "Guwahati", state: "Assam", phone: "7099037005" },
  { id: "prapti-rukmini", name: "Prapti Mart - Rukmini Gaon", address: "Rukmini Gaon, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "7099008155" },
  { id: "premchand-goalpara", name: "Premchand Champalal & Co - Goalpara", address: "Bara Bazar, Kachari Road, Goalpara", city: "Goalpara", state: "Assam", phone: "8638769912" },
  { id: "rs-changsari", name: "R S Suppliers - Changsari", address: "Near Rahul Weigh Bridge, Changsari Road, Sila Sundari Gopha, Changsari", city: "Changsari", state: "Assam", phone: "7099226877" },
  { id: "rakesh-store", name: "Rakesh Store", address: "Hatigarh Charali, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "7670013044" },
  { id: "rk-tarun-nagar", name: "RK Store - Tarun Nagar", address: "ABC, Tarun Nagar, Bylane-5, Guwahati", city: "Guwahati", state: "Assam", phone: "9365127077" },
  { id: "rkgd-athgaon", name: "RKGD Ventures LLP - Athgaon", address: "Opp Rajasthan Lime Udyog, S J Road, Athgaon, Guwahati, Assam, 781001", city: "Guwahati", state: "Assam", phone: "7637858042" },
  { id: "santi-krishnai", name: "Santi Stores - Krishnai", address: "Late Sukumar Sarkar Building, Main Road, Krishnai, Goalpara", city: "Krishnai", state: "Assam", phone: "9706672766" },
  { id: "shankar-dibrugarh", name: "Shankar Bhandar - Dibrugarh", address: "New Market, Dibrugarh-786001, Assam", city: "Dibrugarh", state: "Assam", phone: "9435256225" },
  { id: "shivjiram-silapathar", name: "Shivjiram Ramgopal - Silapathar", address: "Main Road, Silapathar, Dhemaji, Assam", city: "Silapathar", state: "Assam", phone: "9395398847" },
  { id: "shree-ganesh-dibrugarh", name: "Shree Ganesh Stores - Dibrugarh", address: "Cole Road, Dibrugarh", city: "Dibrugarh", state: "Assam", phone: "9401653346" },
  { id: "shree-kanha-ulubari", name: "Shree Kanha's - Ulubari", address: "Opp Rajdeep Apartment, Near DGP Office, B K Kakoti Road, Ulubari, Guwahati", city: "Guwahati", state: "Assam", phone: "9395303177" },
  { id: "radheshyam-lakhimpur", name: "Shree Radheshyam Atta Chakki Mill", address: "Ward No 8, N.T. Road, North Lakhimpur, Lakhimpur, Assam", city: "Lakhimpur", state: "Assam", phone: "9435387616" },
  { id: "shree-ram-dispur", name: "Shree Ram Bhandar - Dispur", address: "Panjabi Gali, G.S. Road, Dispur, Guwahati, Assam", city: "Guwahati", state: "Assam", phone: "9707442703" },
  { id: "sunil-maligaon", name: "Sunil Enterprise - Maligaon", address: "Kamal Commercial Complex, P.N.G.B. Road, Maligaon Charali, Guwahati", city: "Guwahati", state: "Assam", phone: "9954055156" },
  { id: "tirupati-fancy", name: "Tirupati Enterprise - Fancy Bazar", address: "M.S. Road, Fancy Bazar, Guwahati, Assam, 781001", city: "Guwahati", state: "Assam", phone: "8638708108" },
  { id: "tnb-subham", name: "TNB Enterprise - Subham Buildwell", address: "Near Subham Buildwell, Guwahati", city: "Guwahati", state: "Assam", phone: "7002597774" },
  { id: "zenith-nagaon", name: "Zenith Enterprise - Nagaon", address: "Thana Road, Daccapatty, Nagaon, Assam", city: "Nagaon", state: "Assam", phone: "7002654800" },

  // ---- Meghalaya ----
  { id: "balaji-byrnihat", name: "Balaji Store - Byrnihat", address: "Bournuhin, Umtru Road, Below NESF Bank, Byrnihat (Ri-Bhoi), Meghalaya, 793101", city: "Byrnihat", state: "Meghalaya", phone: "8414083051" },
  { id: "ganesh-byrnihat", name: "Ganesh Store - Byrnihat", address: "GS Road, Opp 15th Mile Market, Lum Nongthymmai, Byrnihat, Ri Bhoi, Meghalaya, 793101", city: "Byrnihat", state: "Meghalaya", phone: "8730844648" },
  { id: "ganpati-byrnihat", name: "Ganpati Bhandar - Byrnihat", address: "Byrnihat, Meghalaya - 793101", city: "Byrnihat", state: "Meghalaya", phone: "8107655362" },
  { id: "garohills-tura", name: "Garohills Grain Traders - Tura", address: "T D Road, Near Thakurbari, West Garo Hills, Meghalaya", city: "Tura", state: "Meghalaya", phone: "8974961683" },
  { id: "krishna-byrnihat", name: "Krishna Trading - Byrnihat", address: "Rangsokona, GS Road, Mylliem Syiemship, 15th Mile Nongthymmai, Ri Bhoi, Meghalaya", city: "Byrnihat", state: "Meghalaya", phone: "9863117908" },
  { id: "megha-shillong", name: "Megha Oil's - Shillong", address: "Jeep Stand Paltan Bazar, Shillong-793002", city: "Shillong", state: "Meghalaya", phone: "9862093933" },
  { id: "majaw-nongpoh", name: "S Majaw Store - Nongpoh", address: "27, Nongpoh, Proper, Ri Bhoi, Meghalaya, 792102", city: "Nongpoh", state: "Meghalaya", phone: "6909281532" },
  { id: "tstore-nongpoh", name: "T-Store - Nongpoh", address: "Nongkhrah, Meghalaya, 793102", city: "Nongpoh", state: "Meghalaya", phone: "8787867480" },

  // ---- Manipur ----
  { id: "ashish-imphal", name: "Ashish Traders - Imphal", address: "Patta No. 319, Thangal Bazar, Imphal West, Manipur-795001", city: "Imphal", state: "Manipur", phone: "8974994999" },
  { id: "ashok-churachandpur", name: "Ashok Store - Churachandpur", address: "New Azar Thangzam Road, Churachandpur, Manipur", city: "Churachandpur", state: "Manipur", phone: "7896547085" },
  { id: "ajay-traders-moreh", name: "M/S Ajay Traders - Moreh", address: "Nepali Basti, Moreh, Chandel, Manipur 795131", city: "Moreh", state: "Manipur", phone: "8730939464" },
  { id: "mahalaxmi-imphal", name: "Mahalaxmi Stores - Imphal", address: "Dharamsala Road, Thangal Bazar, Imphal West, Manipur, 795001", city: "Imphal", state: "Manipur", phone: "8638255946" },
  { id: "modern-imphal", name: "Modern Store - Imphal", address: "Majorkhul, M.G. Avenue, Imphal West", city: "Imphal", state: "Manipur", phone: "8974686297" },

  // ---- Tripura ----
  { id: "aritri-agartala", name: "Aritri Enterprise - Agartala", address: "Motorstand, Agartala, West Tripura", city: "Agartala", state: "Tripura", phone: "9863095519" },
  { id: "ashok-paul-khowai", name: "Ashok Kumar Paul - Khowai", address: "Khowai Main Road, Chebri Bazar, Khowai, Tripura, 799207", city: "Khowai", state: "Tripura", phone: "8974257254" },
  { id: "deb-agartala", name: "Deb Trading Agency - Agartala", address: "Chandinamura, Ramnagar, Agartala, West Tripura, Tripura, 799002", city: "Agartala", state: "Tripura", phone: "9366136339" },
  { id: "matri-agartala", name: "Matri Trading Company - Agartala", address: "Old Rice Patty, M G Bazar, Agartala", city: "Agartala", state: "Tripura", phone: "9436459554" },
  { id: "priyankari-agartala", name: "M/S Priyankari Roy - Agartala", address: "BK Road, Palace Compound, Agartala, West Tripura, Tripura", city: "Agartala", state: "Tripura", phone: "7085919170" },
  { id: "paul-teliamura", name: "Paul Agency - Teliamura", address: "Gouranga Tilla, Amarpur Road, Teliamura, Khowai, Tripura", city: "Teliamura", state: "Tripura", phone: "9612312153" },

  // ---- Mizoram ----
  { id: "cl-aizwal", name: "C.L. Agency - Aizwal", address: "1 A-2, C L Agency Building, Arbai Veng, Falkawn, Aizwal, Mizoram - 796005", city: "Aizwal", state: "Mizoram", phone: "9615162843" },

  // ---- Nagaland ----
  { id: "anil-dimapur", name: "Anil Enterprises - Dimapur", address: "G S Road, Near Railway Siding, Dimapur, Nagaland", city: "Dimapur", state: "Nagaland", phone: "9774351062" },
  { id: "northeast-dimapur", name: "Northeast Marketing Co. - Dimapur", address: "Dimapur, Nagaland", city: "Dimapur", state: "Nagaland", phone: "9089665660" },

  // ---- Arunachal Pradesh ----
  { id: "jyoti-naharlagun", name: "Jyoti Trading - Naharlagun", address: "A Sector, Naharlagun, Papum Pare, Arunachal Pradesh", city: "Naharlagun", state: "Arunachal Pradesh", phone: "9774047265" },
  { id: "blue-heaven-arunachal", name: "M/S Blue Heaven Enterprise - Arunachal", address: "Naharlagun, Arunachal Pradesh, 791110", city: "Naharlagun", state: "Arunachal Pradesh", phone: "7337624717" },
  { id: "dnk-itanagar", name: "M/S D N K Enterprises - Itanagar", address: "DNK Building, Gandhi Market Road, Near BSNL Office, C Sector, Itanagar, Papum Pare, 791111", city: "Itanagar", state: "Arunachal Pradesh", phone: "9455899007" },
  { id: "maa-durga-itanagar", name: "Maa Durga Enterprises - Itanagar", address: "Itanagar, Papum Pare, Arunachal Pradesh", city: "Itanagar", state: "Arunachal Pradesh", phone: "9435721644" },

  // ---- West Bengal ----
  { id: "gd-alipurduar", name: "G D Enterprise - Alipurduar", address: "Alipurduar, Kalakali School Road, Newtown, Jalpaiguri", city: "Alipurduar", state: "West Bengal", phone: "9434257950" },
  { id: "omkar-siliguri", name: "Omkar Bhandar - Siliguri", address: "N.R Sector Building, Bidhan Market, Siliguri, Darjeeling, West Bengal 734001", city: "Siliguri", state: "West Bengal", phone: "9083257036" },

  // ---- Bihar ----
  { id: "kundan-purnea", name: "Kundan Traders - Bihar", address: "Abdulla Nagar, Chandan Nagar, Gulabbagh, Purnea, Bihar, 854326", city: "Purnea", state: "Bihar", phone: "6202685869" },

  // ---- Odisha ----
  { id: "kk-rourkela", name: "K.K. Trading Company - Rourkela", address: "Old Station Road, Rourkela, Sundargarh, Odisha, 769001", city: "Rourkela", state: "Odisha", phone: "9437046293" },
];

export function getDistributorsByState(state: string) {
  return DISTRIBUTORS.filter((d) => d.state === state);
}

export function getStatesSorted() {
  const counts = new Map<string, number>();
  for (const d of DISTRIBUTORS) {
    counts.set(d.state, (counts.get(d.state) ?? 0) + 1);
  }
  return STATES.filter((s) => counts.has(s)).map((s) => ({
    state: s,
    count: counts.get(s) ?? 0,
  }));
}

export function getCitiesForState(state: string) {
  const set = new Set<string>();
  for (const d of DISTRIBUTORS) {
    if (d.state === state) set.add(d.city);
  }
  return Array.from(set).sort();
}
