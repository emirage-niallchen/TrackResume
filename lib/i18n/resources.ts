export const resources = {
  zh: {
    translation: {
      common: {
        action: {
          toggleLang: '切换语言',
        },
        lang: {
          zh: '中文',
          en: 'English',
          enShort: 'EN',
        },
      },
      home: {
        section: {
          experience: '工作与教育经历',
          projects: '项目展示',
          techStack: '技术栈',
          contact: '联系我',
        },
        empty: {
          experience: '暂无工作与教育经历',
          projects: '暂无项目展示',
          files: '暂无文件可下载',
        },
        label: {
          detail: '详情',
          projectRole: '项目职责：',
          projectDuration: '项目周期：',
          techSelection: '技术选用:',
          to: '至',
          present: '至今',
          highlights: '主要成就:',
          contactInfo: '联系方式',
        },
        contact: {
          form: {
            label: '感谢您能够留下联系方式：',
            placeholder: '请输入...',
            submit: '提交',
            submitting: '提交中...',
            validation: {
              required: '请输入您的留言',
              tooLong: '内容过长，请精简后再提交',
            },
            toast: {
              success: {
                title: '感谢您的留言！',
                description: '我将尽快与您取得联系！',
              },
              error: {
                title: '提交失败',
                description: '服务器暂时不可用，请稍后再试。',
              },
            },
          },
          info: {
            loading: '加载中...',
            empty: '暂无联系方式',
            copySuccess: '复制成功！',
            copyFailed: '复制失败，请手动复制',
          },
        },
        nav: {
          basic: '基础信息',
          timeline: '简历时间线',
          projects: '项目展示',
          tech: '技术栈',
          contact: '联系方式',
        },
        error: {
          profileFetchFailed: '获取个人信息失败',
        },
      },
      projectDetail: {
        label: {
          role: '职位：',
          techStack: '技术栈：',
          time: '时间：',
        },
        text: {
          present: '至今',
        },
        error: {
          notFound: '项目不存在',
          fetchFailed: '获取详情失败',
        },
        action: {
          toggleLang: '切换语言',
        },
      },
    },
  },
  en: {
    translation: {
      common: {
        action: {
          toggleLang: 'Toggle language',
        },
        lang: {
          zh: 'Chinese',
          en: 'English',
          enShort: 'EN',
        },
      },
      home: {
        section: {
          experience: 'Experience',
          projects: 'Projects',
          techStack: 'Tech Stack',
          contact: 'Contact',
        },
        empty: {
          experience: 'No experience yet.',
          projects: 'No projects yet.',
          files: 'No files available.',
        },
        label: {
          detail: 'Detail',
          projectRole: 'Role: ',
          projectDuration: 'Duration: ',
          techSelection: 'Tech: ',
          to: 'to',
          present: 'Present',
          highlights: 'Highlights:',
          contactInfo: 'Contact info',
        },
        contact: {
          form: {
            label: 'Thanks for leaving your contact details:',
            placeholder: 'Type here...',
            submit: 'Submit',
            submitting: 'Submitting...',
            validation: {
              required: 'Please enter your message.',
              tooLong: 'Message is too long. Please shorten it.',
            },
            toast: {
              success: {
                title: 'Thanks!',
                description: 'I will get back to you soon.',
              },
              error: {
                title: 'Submit failed',
                description: 'Server is unavailable. Please try again later.',
              },
            },
          },
          info: {
            loading: 'Loading...',
            empty: 'No contact info.',
            copySuccess: 'Copied.',
            copyFailed: 'Copy failed. Please copy manually.',
          },
        },
        nav: {
          basic: 'Basics',
          timeline: 'Timeline',
          projects: 'Projects',
          tech: 'Tech',
          contact: 'Contact',
        },
        error: {
          profileFetchFailed: 'Failed to load profile.',
        },
      },
      projectDetail: {
        label: {
          role: 'Role: ',
          techStack: 'Tech stack: ',
          time: 'Time: ',
        },
        text: {
          present: 'Present',
        },
        error: {
          notFound: 'Project not found.',
          fetchFailed: 'Failed to load project detail.',
        },
        action: {
          toggleLang: 'Toggle language',
        },
      },
    },
  },
} as const;


