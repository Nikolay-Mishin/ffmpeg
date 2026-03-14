/*
FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-c:v hevc_nvenc \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high -tune hq \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-0).mkv"
    
FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-c:v hevc_nvenc \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high -tune uhq \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-1).mkv"
    
FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-c:v hevc_nvenc \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high -tune auto \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-2).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-c:v hevc_nvenc \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-3).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-4).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-5).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -hwaccel cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-6).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-7).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
    -cq 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-8).mkv"
    
FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
    -rc cqp \
    -qp 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-9).mkv"
    
FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
    -cq 29.5 \
    -rc cqp \
    -qp 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-10).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
    -rc cqp \
    -qp 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
    -b_ref_mode 1 \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-11).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
	-sar 1/1 -aspect 1920/1080*(1/1) \
    -rc cqp \
    -qp 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
    -b_ref_mode 1 \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-12).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
	-sar 1/1 -aspect 1920/1080*(1/1) \
	-fps_mode passthrough \
    -rc cqp \
    -qp 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
    -b_ref_mode 1 \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-13).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
    -i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
    -pix_fmt p010le \
	-sar 1/1 -aspect 1920/1080*(1/1) \
	-fps_mode passthrough \
	-vf "format=pix_fmts=p010le,scale=1920:1080:flags=bicubic:out_range=limited:out_color_matrix=bt709:out_chroma_loc=left" \
    -rc cqp \
    -qp 29.5 \
    -preset slow -profile:v main10 -level:v 5.1 -tier high \
    -b_ref_mode 1 \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
    -c:a aac -b:a 192k -ar 48000 \
    -c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-14).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
	-i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
	-pix_fmt p010le \
	-sar 1/1 -aspect 1920/1080*(1/1) \
	-fps_mode passthrough \
	-vf "format=pix_fmts=p010le,scale=1920:1080:flags=bicubic:out_range=limited:out_color_matrix=bt709:out_chroma_loc=left" \
	-bsf:v "hevc_metadata=level=5.1:sample_aspect_ratio=1/1:video_full_range_flag=0:matrix_coefficients=1:colour_primaries=1:transfer_characteristics=1:chroma_sample_loc_type=1" \
    -rc cqp \
    -qp 29.5 \
	-preset slow -profile:v main10 -level:v 5.1 -tier high \
    -b_ref_mode 1 \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
	-c:a aac -b:a 192k -ar 48000 \
	-c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-15).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
	-i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
	-pix_fmt p010le \
	-sar 1/1 -aspect 1920/1080*(1/1) \
	-fps_mode passthrough \
	-vf "format=pix_fmts=p010le,scale_npp=1920:1080:interp_algo=bicubic:out_range=limited:out_color_matrix=bt709:out_chroma_loc=left" \
	-bsf:v "hevc_metadata=level=5.1:sample_aspect_ratio=1/1:video_full_range_flag=0:matrix_coefficients=1:colour_primaries=1:transfer_characteristics=1:chroma_sample_loc_type=1" \
    -rc cqp \
    -qp 29.5 \
	-preset slow -profile:v main10 -level:v 5.1 -tier high \
    -b_ref_mode 1 \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
	-c:a aac -b:a 192k -ar 48000 \
	-c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-16).mkv"

FFREPORT="file='D:\Convert\FFMetrics\ffreport.txt':level=32" \
ffmpeg \
    -vsync 0 \
    -hwaccel cuda -hwaccel_output_format cuda \
	-i "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv" \
	-map 0:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0 \
	-c:v hevc_nvenc -tag:v hvc1 \
	-pix_fmt p010le \
	-sar 1/1 -aspect 1920/1080*(1/1) \
	-fps_mode passthrough \
	-vf "format=pix_fmts=p010le,scale_npp=1920:1080:interp_algo=lanczos:out_range=limited:out_color_matrix=bt709:out_chroma_loc=left" \
	-bsf:v "hevc_metadata=level=5.1:sample_aspect_ratio=1/1:video_full_range_flag=0:matrix_coefficients=1:colour_primaries=1:transfer_characteristics=1:chroma_sample_loc_type=1" \
    -rc cqp \
    -qp 29.5 \
	-preset slow -profile:v main10 -level:v 5.1 -tier high \
    -b_ref_mode 1 \
	-x265-params "level=5.1:tier=high:rc-lookahead=60:aq-strength=1.0:subq=8:no-deblock:qcomp=0.60" \
	-c:a aac -b:a 192k -ar 48000 \
	-c:s copy \
	-y "G:/Convert/files/Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(NV-17).mkv"
*/
