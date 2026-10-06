# TỔNG HỢP CHI TIẾT CÁC FILE CHỈNH SỬA CHUYỂN ĐỔI SANG FTP & LOCAL CACHE

> **Hệ thống:** QUALITY CONTROL SYSTEM Ver 2.0  
> **Mục tiêu:** Chuyển đổi toàn bộ cơ chế lưu và đọc file/ảnh từ Windows Share Folder (SMB `\\SERVER\...`) sang giao thức **FTP** kết hợp **Local Cache** ẩn (`%TEMP%\QC_ImageCache`), đảm bảo hiển thị tức thì, không bị nghẽn mạng, không khóa file.

---

## 📑 BẢNG TỔNG HỢP CÁC FILE THAY ĐỔI

| STT | File / Đường dẫn | Thao tác | Số dòng thay đổi | Mục đích / Chức năng chính |
| :---: | :--- | :---: | :---: | :--- |
| **1** | [`QualityControlSystem_Ver2.0/Utils/FtpHelper.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/Utils/FtpHelper.cs) | **Tạo mới** | ~350 dòng | Lớp tiện ích trung tâm: Tải/Upload FTP, quản lý Cache `%TEMP%`, đọc cấu hình linh hoạt |
| **2** | [`QualityControlSystem_Ver2.0/App.config`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/App.config) | Chỉnh sửa | Dòng 3–11 | Thêm `<appSettings>` cấu hình kết nối FTP và thư mục Cache |
| **3** | [`QualityControlSystem_Ver2.0/bin/Debug/CONTROL QC SYSTEM.exe.config`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/bin/Debug/CONTROL%20QC%20SYSTEM.exe.config) | Chỉnh sửa | Dòng 3–11 | Đồng bộ cấu hình chạy trực tiếp của file thực thi `.exe` |
| **4** | [`QualityControlSystem_Ver2.0/QUALITY CONTROL SYSTEM.csproj`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/QUALITY%20CONTROL%20SYSTEM.csproj) | Chỉnh sửa | Dòng 617 | Đăng ký file `Utils\FtpHelper.cs` vào Project Visual Studio |
| **5** | [`QualityControlSystem_Ver2.0/Base/FrmBase.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/Base/FrmBase.cs) | Chỉnh sửa | Dòng 55–84, 275–294 | Chuyển `GetFileForImage`, `GetFileForImageDTS` và hàm `upload` sang `FtpHelper` |
| **6** | [`QualityControlSystem_Ver2.0/User/FrmBase.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/User/FrmBase.cs) | Chỉnh sửa | Dòng 54–61, 238–255 | Sửa hàm `OpenFile` và `upload` sang FTP / Cache DTS SYSTEM |
| **7** | [`QualityControlSystem_Ver2.0/IssueReport/FrmDimensionData_Issue.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/IssueReport/FrmDimensionData_Issue.cs) | Chỉnh sửa | Dòng 108–138 | Xuất Excel báo cáo kích thước và tự động upload lên FTP |
| **8** | [`QualityControlSystem_Ver2.0/Job/FrmKiemTraNgoaiQuanVer2.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/Job/FrmKiemTraNgoaiQuanVer2.cs) | Chỉnh sửa | Dòng 1153–1158, 2467–2475 | Upload hồ sơ CheckSheet lên FTP trong `LuuHS()` & sửa ảnh WANTED sang `GetFileForImage` |
| **9** | [`QualityControlSystem_Ver2.0/Job/FrmListKetQuaKiemTraNewVer.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/Job/FrmListKetQuaKiemTraNewVer.cs) | Chỉnh sửa | Dòng 166–172, 189–194 | Tự động upload file Excel lên FTP tại cả 2 vị trí lưu hồ sơ |
| **10** | [`QualityControlSystem_Ver2.0/DailyRecord/FrmRWRCRev01.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/DailyRecord/FrmRWRCRev01.cs) | Chỉnh sửa | Dòng 167–176 | Sửa ảnh hạng mục từ `\\CTS-MOLD-VNSV01\qc system\Hangmuc\` sang `GetFileForImage` |
| **11** | [`QualityControlSystem_Ver2.0/Job/FrmFormRequestDTSSuaKhuon.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/Job/FrmFormRequestDTSSuaKhuon.cs) | Chỉnh sửa | Dòng 156–166 | Sửa ảnh lỗi khuôn từ `\\CTS-MOLD-VNSV01\QC SYSTEM\` sang `GetFileForImage` |
| **12** | [`QualityControlSystem_Ver2.0/Report/FrmBieuDoThongKe.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/Report/FrmBieuDoThongKe.cs) | Chỉnh sửa | Dòng 148–158, 244–254 | Sửa 2 vị trí tải ảnh HANGMUCDO từ `\\CTS-MOLD-VNSV01\` sang `GetFileForImage` |
| **13** | [`QualityControlSystem_Ver2.0/Resource/FrmGroupPartLoiKhuon.cs`](file:///d:/Share/qc/QC-SYStem%20Post/QualityControlSystem_Ver2.0/Resource/FrmGroupPartLoiKhuon.cs) | Chỉnh sửa | Dòng 86–97 | Sửa ảnh lỗi khuôn từ `\\CTS-MOLD-VNSV01\QC SYSTEM\` sang `GetFileForImage` |
| **14** | [`scripts/run_ftp_server.py`](file:///d:/Share/qc/QC-SYStem%20Post/scripts/run_ftp_server.py) | **Tạo mới** | 80 dòng | Máy chủ FTP nội bộ bằng Python (`pyftpdlib`), port 21, user `qc`, `QC SYSTEM`, `super` |
| **15** | [`start_ftp_server.bat`](file:///d:/Share/qc/QC-SYStem%20Post/start_ftp_server.bat) | **Tạo mới** | 10 dòng | File batch click 1 chạm để khởi động nhanh FTP Server |

---

## 🔍 CHI TIẾT NỘI DUNG CODE THAY ĐỔI THEO TỪNG FILE

### 1. File mới: `QualityControlSystem_Ver2.0/Utils/FtpHelper.cs`
- **Số dòng:** 402 dòng
- **Chức năng:** Lớp tiện ích trung tâm xử lý tải/upload file qua giao thức FTP, quản lý bộ đệm ẩn `%TEMP%\QC_ImageCache`, đọc cấu hình linh hoạt từ file config của hệ thống.
- **Toàn bộ mã nguồn code C#:**

```csharp
using System;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Net;

namespace QualityControlSystem_Ver2._0.Utils
{
    /// <summary>
    /// Tiện ích quản lý tải ảnh và tài liệu qua giao thức FTP kết hợp bộ đệm cục bộ (Local Cache)
    /// Giúp hiển thị ảnh tức thì, không làm nghẽn mạng, không phụ thuộc quyền chia sẻ thư mục Windows (SMB)
    /// </summary>
    public static class FtpHelper
    {
        private static readonly string _ftpServer;
        private static readonly int _ftpPort;
        private static readonly string _ftpUser;
        private static readonly string _ftpPass;
        private static readonly string _ftpRemoteFolder;
        private static readonly string _cacheBaseDir;
        private static readonly int _timeoutMs;

        private static string ReadSetting(string key, string defaultValue)
        {
            try
            {
                string val = ConfigurationManager.AppSettings[key];
                if (!string.IsNullOrWhiteSpace(val))
                    return val.Trim();

                // Nếu chạy trong AppDomain khác (PowerShell, Test runner...), đọc trực tiếp từ file .exe.config
                string asmPath = typeof(FtpHelper).Assembly.Location;
                if (!string.IsNullOrEmpty(asmPath) && File.Exists(asmPath))
                {
                    var exeConfig = ConfigurationManager.OpenExeConfiguration(asmPath);
                    if (exeConfig != null && exeConfig.AppSettings != null)
                    {
                        var setting = exeConfig.AppSettings.Settings[key];
                        if (setting != null && !string.IsNullOrWhiteSpace(setting.Value))
                            return setting.Value.Trim();
                    }
                }
            }
            catch { }
            return defaultValue;
        }

        static FtpHelper()
        {
            try
            {
                _ftpServer = ReadSetting("FtpServer", "127.0.0.1");

                int port;
                if (!int.TryParse(ReadSetting("FtpPort", "21"), out port))
                {
                    port = 21;
                }
                _ftpPort = port;

                _ftpUser = ReadSetting("FtpUser", "qc");
                _ftpPass = ReadSetting("FtpPass", "qc");
                _ftpRemoteFolder = ReadSetting("FtpRemoteFolder", "QC SYSTEM");

                int timeout;
                if (!int.TryParse(ReadSetting("FtpTimeoutMs", "6000"), out timeout))
                {
                    timeout = 6000; // 6 giây timeout
                }
                _timeoutMs = timeout;

                // Xác định thư mục lưu trữ Cache trên máy trạm (mặc định dùng thư mục Temp ẩn của Windows)
                string customCache = ReadSetting("FtpCacheDir", "");
                if (!string.IsNullOrWhiteSpace(customCache))
                {
                    _cacheBaseDir = Environment.ExpandEnvironmentVariables(customCache.Trim());
                }
                else
                {
                    _cacheBaseDir = Path.Combine(Path.GetTempPath(), "QC_ImageCache");
                }

                if (!Directory.Exists(_cacheBaseDir))
                {
                    Directory.CreateDirectory(_cacheBaseDir);
                }
            }
            catch
            {
                _ftpServer = "127.0.0.1";
                _ftpPort = 21;
                _ftpUser = "qc";
                _ftpPass = "qc";
                _ftpRemoteFolder = "QC SYSTEM";
                _cacheBaseDir = Path.Combine(Path.GetTempPath(), "QC_ImageCache");
                _timeoutMs = 6000;
            }
        }

        public static string FtpServer => _ftpServer;
        public static string CacheBaseDir => _cacheBaseDir;

        /// <summary>
        /// Lấy đường dẫn file cục bộ từ bộ đệm Cache. Nếu chưa có trong Cache, tự động tải qua FTP.
        /// </summary>
        /// <param name="filename">Tên file hoặc đường dẫn file</param>
        /// <param name="remoteFolder">Thư mục trên FTP (mặc định lấy theo cấu hình)</param>
        /// <returns>Đường dẫn file cục bộ hợp lệ, hoặc chuỗi rỗng nếu không tìm thấy</returns>
        public static string GetLocalFilePath(string filename, string remoteFolder = null)
        {
            if (string.IsNullOrWhiteSpace(filename))
                return string.Empty;

            try
            {
                string cleanName = Path.GetFileName(filename.Trim());
                if (string.IsNullOrWhiteSpace(cleanName))
                    return string.Empty;

                string folderName = string.IsNullOrWhiteSpace(remoteFolder) ? _ftpRemoteFolder : remoteFolder.Trim();
                string targetDir = Path.Combine(_cacheBaseDir, folderName.Replace(" ", "_"));
                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                }

                string localPath = Path.Combine(targetDir, cleanName);

                // 1. Kiểm tra nếu file đã có trong Cache cục bộ và hợp lệ (kích thước > 0)
                if (File.Exists(localPath))
                {
                    try
                    {
                        var fi = new FileInfo(localPath);
                        if (fi.Length > 0)
                        {
                            return localPath;
                        }
                    }
                    catch { }
                }

                // 2. Tải file từ máy chủ FTP về thư mục Cache
                bool downloadOk = DownloadFromFtp(cleanName, folderName, localPath);
                if (downloadOk && File.Exists(localPath))
                {
                    return localPath;
                }

                // 3. Cơ chế Fallback dự phòng: Nếu FTP không có hoặc lỗi, thử kiểm tra qua UNC Share folder cũ
                string uncPath = string.Format(@"\\{0}\{1}\{2}", _ftpServer, folderName, cleanName);
                if (File.Exists(uncPath))
                {
                    try
                    {
                        File.Copy(uncPath, localPath, true);
                        return localPath;
                    }
                    catch
                    {
                        return uncPath;
                    }
                }

                // Trả về localPath (để caller xử lý FileNotFound nếu file thực sự chưa tồn tại trên hệ thống)
                return localPath;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[FtpHelper.GetLocalFilePath] Lỗi: {ex.Message}");
                return string.Empty;
            }
        }

        /// <summary>
        /// Tải trực tiếp đối tượng Image an toàn từ FTP (đọc qua MemoryStream, không khóa file trên ổ đĩa)
        /// </summary>
        public static Image GetImage(string filename, string remoteFolder = null)
        {
            string localPath = GetLocalFilePath(filename, remoteFolder);
            if (string.IsNullOrWhiteSpace(localPath) || !File.Exists(localPath))
                return null;

            try
            {
                byte[] bytes = File.ReadAllBytes(localPath);
                using (var ms = new MemoryStream(bytes))
                {
                    return Image.FromStream(ms);
                }
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Thực thi tải file từ máy chủ FTP về đường dẫn cục bộ
        /// </summary>
        private static bool DownloadFromFtp(string filename, string remoteFolder, string destinationPath)
        {
            string tempFile = destinationPath + ".tmp_" + Guid.NewGuid().ToString("N");

            try
            {
                // Xây dựng URL FTP chuẩn
                string remotePath = string.IsNullOrWhiteSpace(remoteFolder) ? filename : $"{remoteFolder}/{filename}";
                string ftpUri = $"ftp://{_ftpServer}:{_ftpPort}/{Uri.EscapeUriString(remotePath)}";

                var request = (FtpWebRequest)WebRequest.Create(ftpUri);
                request.Method = WebRequestMethods.Ftp.DownloadFile;
                request.Credentials = new NetworkCredential(_ftpUser, _ftpPass);
                request.UseBinary = true;
                request.KeepAlive = false;
                request.Timeout = _timeoutMs;
                request.ReadWriteTimeout = _timeoutMs;

                // Tự động nhận diện chế độ Passive
                request.UsePassive = true;

                using (var response = (FtpWebResponse)request.GetResponse())
                using (var responseStream = response.GetResponseStream())
                using (var fs = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = responseStream.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        fs.Write(buffer, 0, bytesRead);
                    }
                }

                // Đổi tên file tạm thời thành file chính thức (Atomic operation)
                if (File.Exists(destinationPath))
                {
                    File.Delete(destinationPath);
                }
                File.Move(tempFile, destinationPath);
                return true;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[FtpHelper.DownloadFromFtp] Không thể tải {filename}: {ex.Message}");
                
                // Nếu tải không thành công với folder con, thử tải trực tiếp từ thư mục gốc FTP
                if (!string.IsNullOrWhiteSpace(remoteFolder))
                {
                    try
                    {
                        string fallbackUri = $"ftp://{_ftpServer}:{_ftpPort}/{Uri.EscapeUriString(filename)}";
                        var reqFallback = (FtpWebRequest)WebRequest.Create(fallbackUri);
                        reqFallback.Method = WebRequestMethods.Ftp.DownloadFile;
                        reqFallback.Credentials = new NetworkCredential(_ftpUser, _ftpPass);
                        reqFallback.UseBinary = true;
                        reqFallback.KeepAlive = false;
                        reqFallback.Timeout = _timeoutMs;
                        reqFallback.ReadWriteTimeout = _timeoutMs;
                        reqFallback.UsePassive = true;

                        using (var resp = (FtpWebResponse)reqFallback.GetResponse())
                        using (var rs = resp.GetResponseStream())
                        using (var fs = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None))
                        {
                            byte[] buffer = new byte[8192];
                            int bytesRead;
                            while ((bytesRead = rs.Read(buffer, 0, buffer.Length)) > 0)
                            {
                                fs.Write(buffer, 0, bytesRead);
                            }
                        }

                        if (File.Exists(destinationPath)) File.Delete(destinationPath);
                        File.Move(tempFile, destinationPath);
                        return true;
                    }
                    catch { }
                }

                return false;
            }
            finally
            {
                if (File.Exists(tempFile))
                {
                    try { File.Delete(tempFile); } catch { }
                }
            }
        }

        /// <summary>
        /// Tải một file từ máy trạm lên máy chủ FTP
        /// Đồng thời sao chép vào bộ đệm Cache cục bộ (%TEMP%\QC_ImageCache) để máy trạm xem được ngay tức thì
        /// </summary>
        /// <param name="localFilePath">Đường dẫn file trên máy trạm</param>
        /// <param name="remoteFileName">Tên file lưu trên máy chủ FTP</param>
        /// <param name="remoteFolder">Thư mục trên máy chủ FTP (mặc định lấy theo cấu hình FtpRemoteFolder)</param>
        /// <returns>True nếu upload thành công, False nếu thất bại</returns>
        public static bool UploadFile(string localFilePath, string remoteFileName, string remoteFolder = null)
        {
            if (string.IsNullOrWhiteSpace(localFilePath) || !File.Exists(localFilePath))
                return false;

            if (string.IsNullOrWhiteSpace(remoteFileName))
                remoteFileName = Path.GetFileName(localFilePath);

            string folderName = string.IsNullOrWhiteSpace(remoteFolder) ? _ftpRemoteFolder : remoteFolder.Trim();

            // 1. Đồng bộ file vào bộ đệm cục bộ (Cache) ngay lập tức
            try
            {
                string targetDir = Path.Combine(_cacheBaseDir, folderName.Replace(" ", "_"));
                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                }
                string cachePath = Path.Combine(targetDir, Path.GetFileName(remoteFileName));
                if (!string.Equals(Path.GetFullPath(localFilePath), Path.GetFullPath(cachePath), StringComparison.OrdinalIgnoreCase))
                {
                    File.Copy(localFilePath, cachePath, true);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[FtpHelper.UploadFile] Lưu cache lỗi: {ex.Message}");
            }

            // 2. Upload file lên máy chủ FTP
            try
            {
                string remotePath = string.IsNullOrWhiteSpace(folderName) ? remoteFileName : $"{folderName}/{remoteFileName}";
                string ftpUri = $"ftp://{_ftpServer}:{_ftpPort}/{Uri.EscapeUriString(remotePath)}";

                var request = (FtpWebRequest)WebRequest.Create(ftpUri);
                request.Method = WebRequestMethods.Ftp.UploadFile;
                request.Credentials = new NetworkCredential(_ftpUser, _ftpPass);
                request.UseBinary = true;
                request.KeepAlive = false;
                request.Timeout = _timeoutMs * 2;
                request.ReadWriteTimeout = _timeoutMs * 2;
                request.UsePassive = true;

                using (var fileStream = new FileStream(localFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                using (var ftpStream = request.GetRequestStream())
                {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = fileStream.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        ftpStream.Write(buffer, 0, bytesRead);
                    }
                }

                using (var response = (FtpWebResponse)request.GetResponse())
                {
                    return response.StatusCode == FtpStatusCode.CommandOK || 
                           response.StatusCode == FtpStatusCode.ClosingData || 
                           response.StatusCode == FtpStatusCode.FileActionOK;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[FtpHelper.UploadFile] Lỗi upload: {ex.Message}");
                // Fallback với tài khoản folder_name / ""
                try
                {
                    string remotePath = string.IsNullOrWhiteSpace(folderName) ? remoteFileName : $"{folderName}/{remoteFileName}";
                    string ftpUri = $"ftp://{_ftpServer}:{_ftpPort}/{Uri.EscapeUriString(remotePath)}";
                    var reqFallback = (FtpWebRequest)WebRequest.Create(ftpUri);
                    reqFallback.Method = WebRequestMethods.Ftp.UploadFile;
                    reqFallback.Credentials = new NetworkCredential(folderName, "");
                    reqFallback.UseBinary = true;
                    reqFallback.KeepAlive = false;
                    reqFallback.Timeout = _timeoutMs * 2;
                    reqFallback.ReadWriteTimeout = _timeoutMs * 2;
                    reqFallback.UsePassive = true;

                    using (var fs = new FileStream(localFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    using (var reqStream = reqFallback.GetRequestStream())
                    {
                        byte[] buf = new byte[8192];
                        int read;
                        while ((read = fs.Read(buf, 0, buf.Length)) > 0)
                        {
                            reqStream.Write(buf, 0, read);
                        }
                    }

                    using (var resp = (FtpWebResponse)reqFallback.GetResponse())
                    {
                        return true;
                    }
                }
                catch
                {
                    return false;
                }
            }
        }
    }
}
```

---

### 2. File: `QualityControlSystem_Ver2.0/App.config` & `CONTROL QC SYSTEM.exe.config`
- **Vị trí:** Dòng 3 – 11
- **Code thêm vào:**
```xml
  <appSettings>
    <add key="FtpServer" value="127.0.0.1" />
    <add key="FtpPort" value="21" />
    <add key="FtpUser" value="qc" />
    <add key="FtpPass" value="qc" />
    <add key="FtpRemoteFolder" value="QC SYSTEM" />
    <add key="FtpTimeoutMs" value="6000" />
    <add key="FtpCacheDir" value="%TEMP%\QC_ImageCache" />
  </appSettings>
```

---

### 3. File: `QualityControlSystem_Ver2.0/Base/FrmBase.cs`
#### a) Hàm `GetFileForImage` và `GetFileForImageDTS` (Dòng 55–84)
- **Trước khi sửa:**
```csharp
public static string GetFileForImage(string filename)
{
     return string.Format(@"\\{0}\{1}\{2}", SERVER, FTP_FOLDER_ACCOUNT, filename);
}

public static string GetFileForImageDTS(string filename)
{
     return string.Format(@"\\{0}\{1}\{2}", SERVER, "DTS SYSTEM", filename);
}
```
- **Sau khi sửa:**
```csharp
public static string GetFileForImage(string filename)
{
    if (string.IsNullOrWhiteSpace(filename))
        return string.Empty;

    // Tự động tải từ máy chủ FTP về thư mục Cache máy trạm và trả về đường dẫn cục bộ
    string localPath = FtpHelper.GetLocalFilePath(filename, FTP_FOLDER_ACCOUNT);
    if (!string.IsNullOrEmpty(localPath) && File.Exists(localPath))
        return localPath;

    // Dự phòng (fallback) về đường dẫn share folder cũ
    return string.Format(@"\\{0}\{1}\{2}", SERVER, FTP_FOLDER_ACCOUNT, filename);
}

public static string GetFileForImageDTS(string filename)
{
    if (string.IsNullOrWhiteSpace(filename))
        return string.Empty;

    string localPath = FtpHelper.GetLocalFilePath(filename, "DTS SYSTEM");
    if (!string.IsNullOrEmpty(localPath) && File.Exists(localPath))
        return localPath;

    return string.Format(@"\\{0}\{1}\{2}", SERVER, "DTS SYSTEM", filename);
}
```

#### b) Hàm `upload(string path, string filename)` (Dòng 275–294)
- **Trước khi sửa:** Copy vào `D:\qc` và kết nối FTP hardcoded server cũ `CTS-MOLD-VNSV01` vào root:
```csharp
public void upload(string path, string filename)
{
    try
    {
        string destDir = @"D:\qc";
        if (!Directory.Exists(destDir))
        {
            Directory.CreateDirectory(destDir);
        }
        File.Copy(path, Path.Combine(destDir, filename), true);

        this.ftpRequest = (FtpWebRequest)WebRequest.Create(ftp_kn + filename);
        this.ftpRequest.Credentials = new NetworkCredential(FTP_FOLDER_ACCOUNT, "");
        // ... upload thủ công bằng byte buffer ...
        ShowAlertString("Đã tải file thành công!", "Nhấn CTR + S để lưu", IconAlert.Done);
    }
    catch (Exception)
    {
        ShowAlertString("Lỗi tải lên", "Kiểm tra lại đường truyền mạng hoặc xác thực tài khoản đên SERVER!", IconAlert.Error);
    }
}
```
- **Sau khi sửa:** Đẩy trực tiếp lên FTP server qua cấu hình và đồng bộ cache, bỏ hoàn toàn copy rác vào `D:\qc`:
```csharp
public void upload(string path, string filename)
{
    try
    {
        bool success = FtpHelper.UploadFile(path, filename, FTP_FOLDER_ACCOUNT);
        if (success)
        {
            ShowAlertString("Đã tải file thành công!", "Nhấn CTR + S để lưu", IconAlert.Done);
        }
        else
        {
            ShowAlertString("Lỗi tải lên", "Kiểm tra lại kết nối FTP Server hoặc quyền ghi thư mục!", IconAlert.Error);
        }
    }
    catch (Exception ex)
    {
        ShowAlertString("Lỗi tải lên", $"Chi tiết: {ex.Message}", IconAlert.Error);
    }
}
```

---

### 4. File: `QualityControlSystem_Ver2.0/User/FrmBase.cs`
#### a) Hàm `OpenFile` (Dòng 54–61)
- **Trước khi sửa:** Mở trực tiếp từ đường dẫn mạng SMB `\\10.16.2.11\DTS_SYSTEM\`
```csharp
process.StartInfo.FileName = String.Format(@"\\{0}\{1}\{2}", SERVER, FTP_FOLDER_ACCOUNT, filename);
```
- **Sau khi sửa:** Tải file qua FTP về cache máy local rồi mở:
```csharp
string localPath = FtpHelper.GetLocalFilePath(filename, "DTS SYSTEM");
process.StartInfo.FileName = (!string.IsNullOrEmpty(localPath) && File.Exists(localPath)) 
    ? localPath 
    : String.Format(@"\\{0}\{1}\{2}", SERVER, FTP_FOLDER_ACCOUNT, filename);
```

#### b) Hàm `upload` (Dòng 238–255)
- **Sau khi sửa:**
```csharp
public void upload(string path, string filename)
{
    try
    {
        bool success = FtpHelper.UploadFile(path, filename, "DTS SYSTEM");
        if (success)
        {
            ShowAlertString("Đã tải file thành công!", "Nhấn CTR + S để lưu", IconAlert.Done);
        }
        else
        {
            ShowAlertString("Lỗi tải lên", "Kiểm tra lại kết nối FTP Server hoặc quyền ghi thư mục!", IconAlert.Error);
        }
    }
    catch (Exception)
    {
        ShowAlertString("Lỗi tải lên", "Kiểm tra lại đường truyền mạng hoặc xác thực tài khoản đên SERVER!", IconAlert.Error);
        throw new Exception();
    }
}
```

---

### 5. File: `QualityControlSystem_Ver2.0/IssueReport/FrmDimensionData_Issue.cs`
- **Vị trí:** Dòng 108 – 138
- **Trước khi sửa:**
```csharp
    foreach (var ip in Dns.GetHostEntry(Dns.GetHostName()).AddressList)
    {
        if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
        {
            string ipPC = ip.ToString();

            //CVN
            if (ipPC.StartsWith("10.16.2."))
            {
                report.ExportToXlsx(filename);
            }
            //JIG
            else if (ipPC.StartsWith("10.0.75."))
            {
                using (var ms = new MemoryStream())
                {
                    report.ExportToXlsx(ms);
                    byte[] excel = ms.ToArray();
                    var tb_Recordkeeping = new tb_Recordkeeping(UOW);
                    tb_Recordkeeping.FileData = excel;
                    tb_Recordkeeping.FileName = filename;
                    tb_Recordkeeping.UploadDate = DateTime.Now;
                    tb_Recordkeeping.Status = 0;
                    this.Save();
                }
            }
        }
    }
```
- **Sau khi sửa:** Xuất file ra local, đẩy ngay lên FTP server, và vẫn giữ nhánh lưu DB của JIG:
```csharp
    // 1. Xuất file báo cáo ra thư mục cục bộ
    report.ExportToXlsx(filename);

    // 2. Tải ngay file lên máy chủ FTP Server
    FtpHelper.UploadFile(filename, timea + ".xlsx", "QC SYSTEM");

    // 3. Nếu ở mạng JIG (10.0.75.) thì lưu thêm vào bảng tb_Recordkeeping
    try
    {
        foreach (var ip in Dns.GetHostEntry(Dns.GetHostName()).AddressList)
        {
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                string ipPC = ip.ToString();
                if (ipPC.StartsWith("10.0.75."))
                {
                    using (var ms = new MemoryStream())
                    {
                        report.ExportToXlsx(ms);
                        byte[] excel = ms.ToArray();
                        var tb_Recordkeeping = new tb_Recordkeeping(UOW);
                        tb_Recordkeeping.FileData = excel;
                        tb_Recordkeeping.FileName = filename;
                        tb_Recordkeeping.UploadDate = DateTime.Now;
                        tb_Recordkeeping.Status = 0;
                        this.Save();
                    }
                    break;
                }
            }
        }
    }
    catch { }
```

---

### 6. File: `QualityControlSystem_Ver2.0/Job/FrmKiemTraNgoaiQuanVer2.cs`
#### a) Hàm `LuuHS` (Dòng 1153 – 1158)
- **Trước khi sửa:**
```csharp
string timea = DateTime.Now.ToString("ddMMyyyyHHmmss");
string filename = GetFileForImage(timea + ".xlsx");
report.ExportToXlsx(filename);
tb_IssueCheckSheet itemSave = new tb_IssueCheckSheet(UOWLuuhoso);
```
- **Sau khi sửa:** Bổ sung upload file lên FTP:
```csharp
string timea = DateTime.Now.ToString("ddMMyyyyHHmmss");
string filename = GetFileForImage(timea + ".xlsx");
report.ExportToXlsx(filename);
FtpHelper.UploadFile(filename, timea + ".xlsx", "QC SYSTEM");
tb_IssueCheckSheet itemSave = new tb_IssueCheckSheet(UOWLuuhoso);
```

#### b) Hiển thị ảnh Wanted (Dòng 2467 – 2475)
- **Trước khi sửa:**
```csharp
pictureAnhLoi.Image = Image.FromFile(@"\\CTS-MOLD-VNSV01\qc system\WANTED\" + (myPartProblem[0] as tb_PartProblem).attachvande);
```
- **Sau khi sửa:**
```csharp
string attachFile = (myPartProblem[0] as tb_PartProblem).attachvande;
string path = GetFileForImage("WANTED/" + attachFile);
if (System.IO.File.Exists(path))
    pictureAnhLoi.Image = Image.FromFile(path);
```

---

### 7. File: `QualityControlSystem_Ver2.0/Job/FrmListKetQuaKiemTraNewVer.cs`
#### a) Vị trí 1: Bấm nút Issue báo cáo (Dòng 166 – 172)
- **Sau khi sửa:**
```csharp
string timea = DateTime.Now.ToString("ddMMyyyyHHmmss");
string filename = GetFileForImage(timea + ".xlsx");
report.ExportToXlsx(filename);
FtpHelper.UploadFile(filename, timea + ".xlsx", "QC SYSTEM");
if (Dialog.ShowYesNoDialog("Đã issue thành công! Bạn có muốn mở file không?") == System.Windows.Forms.DialogResult.Yes)
    OpenAfterExport(filename);
```

#### b) Vị trí 2: Lưu hồ sơ kết quả kiểm tra (Dòng 189 – 194)
- **Sau khi sửa:**
```csharp
string timea = DateTime.Now.ToString("ddMMyyyyHHmmss");
string filename = GetFileForImage(timea + ".xlsx");
report.ExportToXlsx(filename);
FtpHelper.UploadFile(filename, timea + ".xlsx", "QC SYSTEM");
tb_IssueCheckSheet itemSave = new tb_IssueCheckSheet(UOW);
```

---

### 8. File: `QualityControlSystem_Ver2.0/DailyRecord/FrmRWRCRev01.cs`
- **Vị trí:** Dòng 167 – 176
- **Trước khi sửa:**
```csharp
pictureEdit1.Image = Image.FromFile(@"\\CTS-MOLD-VNSV01\qc system\Hangmuc\" + item.hinhanh);
```
- **Sau khi sửa:**
```csharp
if (item != null && !string.IsNullOrEmpty(item.hinhanh))
{
    string path = GetFileForImage("Hangmuc/" + item.hinhanh);
    if (System.IO.File.Exists(path))
        pictureEdit1.Image = Image.FromFile(path);
}
```

---

### 9. File: `QualityControlSystem_Ver2.0/Job/FrmFormRequestDTSSuaKhuon.cs`
- **Vị trí:** Dòng 156 – 166
- **Trước khi sửa:**
```csharp
item.Image = Image.FromFile(@"\\CTS-MOLD-VNSV01\QC SYSTEM\" +(xpCGroupPartLoiKhuon[i] as tb_grouppartloikhuon).hinhanh.ToString());
item.Caption = (xpCGroupPartLoiKhuon[i] as tb_grouppartloikhuon).hinhanh.ToString() + " " + (xpCGroupPartLoiKhuon[i] as tb_grouppartloikhuon).item.ToString();
```
- **Sau khi sửa:**
```csharp
string imgName = (xpCGroupPartLoiKhuon[i] as tb_grouppartloikhuon).hinhanh.ToString();
string path = GetFileForImage(imgName);
if (System.IO.File.Exists(path))
    item.Image = Image.FromFile(path);
item.Caption = imgName + " " + (xpCGroupPartLoiKhuon[i] as tb_grouppartloikhuon).item.ToString();
```

---

### 10. File: `QualityControlSystem_Ver2.0/Report/FrmBieuDoThongKe.cs`
- **Vị trí 1 (Dòng 148 – 158) & Vị trí 2 (Dòng 244 – 254):**
- **Trước khi sửa:**
```csharp
pictureEdit1.Image = Image.FromFile(@"\\CTS-MOLD-VNSV01\qc system\HANGMUCDO\" + itemDo.hinhanh);
```
- **Sau khi sửa:**
```csharp
if (itemDo != null && !string.IsNullOrEmpty(itemDo.hinhanh))
{
    string path = GetFileForImage("HANGMUCDO/" + itemDo.hinhanh);
    if (System.IO.File.Exists(path))
        pictureEdit1.Image = Image.FromFile(path);
}
```

---

### 11. File: `QualityControlSystem_Ver2.0/Resource/FrmGroupPartLoiKhuon.cs`
- **Vị trí:** Dòng 86 – 97
- **Trước khi sửa:**
```csharp
item.Image = Image.FromFile(@"\\CTS-MOLD-VNSV01\QC SYSTEM\" + myGridView2.GetRowCellValue(i, "hinhanh").ToString());
```
- **Sau khi sửa:**
```csharp
string imgFile = myGridView2.GetRowCellValue(i, "hinhanh")?.ToString();
if (!string.IsNullOrEmpty(imgFile))
{
    string path = GetFileForImage(imgFile);
    if (System.IO.File.Exists(path))
        item.Image = Image.FromFile(path);
}
```

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY & VẬN HÀNH

1. **Khởi động FTP Server trên máy chủ:**
   - Nhấp đúp chuột vào file [`start_ftp_server.bat`](file:///d:/Share/qc/QC-SYStem%20Post/start_ftp_server.bat).
   - Thư mục lưu dữ liệu FTP: `D:\qc\FTPServer_Root\` (gồm `QC SYSTEM` và `DTS SYSTEM`).

2. **Cấu hình khi triển khai sang Server thật:**
   - Mở file `CONTROL QC SYSTEM.exe.config` trên các máy trạm, thay đổi:
     ```xml
     <add key="FtpServer" value="IP_MÁY_CHỦ_FTP" />
     ```
   - Không cần phải build lại code khi đổi IP máy chủ.
