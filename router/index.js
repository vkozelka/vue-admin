import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Dashboard from '@/components/Pages/Dashboard'
import Articles from '@/components/Pages/Articles'
import ArticlesAdd from '@/components/Pages/Articles/Add'
import ArticlesEdit from '@/components/Pages/Articles/Edit'
import ArticleCategory from '@/components/Pages/ArticleCategory'
import Pages from '@/components/Pages/Pages'
import PagesAdd from '@/components/Pages/Pages/Add'
import PagesEdit from '@/components/Pages/Pages/Edit'
import Images from '@/components/Pages/Images'
import Users from '@/components/Pages/Users'
import UsersCompany from '@/components/Pages/UsersCompany'
import UsersCompanyTeam from '@/components/Pages/UsersCompanyTeam'
import UsersEdit from '@/components/Pages/Users/Edit'
import UsersAdd from '@/components/Pages/Users/Add'

import Transaction from '@/components/Pages/Transaction'
import TransactionEdit from '@/components/Pages/Transaction/Edit'

import Emails from '@/components/Pages/Emails'
import EmailsEdit from '@/components/Pages/Emails/Edit'
import EmailsAdd from '@/components/Pages/Emails/Add'

import Translation from '@/components/Pages/Translation'
import TranslationAdd from '@/components/Pages/Translation/Add'

import JobLogs from '@/components/Pages/JobLogs'
import JobLogsTeam from '@/components/Pages/JobLogsTeam'
import JobLogBlacklist from '@/components/Pages/JobLogBlacklist'
import Job from '@/components/Pages/Job'
import JobFilter from '@/components/Pages/JobFilter'
import JobTeam from '@/components/Pages/JobTeam'
import JobTeamFilter from '@/components/Pages/JobTeamFilter'

import Benefits from '@/components/Pages/Benefits'
import BenefitsAdd from '@/components/Pages/Benefits/Add'
import BenefitsEdit from '@/components/Pages/Benefits/Edit'

import Addons from '@/components/Pages/Addons'
import AddonsEdit from '@/components/Pages/Addons/Edit'
import AddonsAdd from '@/components/Pages/Addons/Add'

import Settings from '@/components/Pages/Settings'
import ShareImages from '@/components/Pages/ShareImages'

import JobLanguages from '@/components/Pages/JobLanguages'
import JobLanguagesEdit from '@/components/Pages/JobLanguages/Edit'
import JobLanguagesAdd from '@/components/Pages/JobLanguages/Add'

import AppLogs from '@/components/Pages/AppLogs'
import AppLogsTeam from '@/components/Pages/AppLogsTeam'

import AdminUser from '@/components/Pages/AdminUser'
import AdminUserEdit from '@/components/Pages/AdminUser/Edit'
import AdminUserAdd from '@/components/Pages/AdminUser/Add'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', name: 'login', component: Login, meta: { requireAuth: false } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requireAuth: true } },
    { path: '/articles', name: 'articles', component: Articles, meta: { requireAuth: true } },
    { path: '/articles/new', name: 'articles-add', component: ArticlesAdd, meta: { requireAuth: true } },
    { path: '/articles/:id', name: 'articles-edit', component: ArticlesEdit, meta: { requireAuth: true } },
    { path: '/article-categories', name: 'article-category', component: ArticleCategory, meta: { requireAuth: true } },
    { path: '/pages', name: 'pages', component: Pages, meta: { requireAuth: true } },
    { path: '/pages/new', name: 'pages-add', component: PagesAdd, meta: { requireAuth: true } },
    { path: '/pages/:id', name: 'pages-edit', component: PagesEdit, meta: { requireAuth: true } },
    { path: '/images', name: 'images', component: Images, meta: { requireAuth: true } },
    { path: '/users', name: 'users', component: Users, meta: { requireAuth: true } },
    { path: '/companies', name: 'companies', component: UsersCompany, meta: { requireAuth: true } },
    { path: '/companies-team', name: 'companies-team', component: UsersCompanyTeam, meta: { requireAuth: true } },
    { path: '/users/new', name: 'users-add', component: UsersAdd, meta: { requireAuth: true } },
    { path: '/users/:id', name: 'users-edit', component: UsersEdit, meta: { requireAuth: true } },
    { path: '/emails', name: 'emails', component: Emails, meta: { requireAuth: true } },
    { path: '/emails/new', name: 'emails-add', component: EmailsAdd, meta: { requireAuth: true } },
    { path: '/emails/:id', name: 'emails-edit', component: EmailsEdit, meta: { requireAuth: true } },
    { path: '/translations', name: 'translations', component: Translation, meta: { requireAuth: true } },
    { path: '/translations/new', name: 'translations-add', component: TranslationAdd, meta: { requireAuth: true } },
    { path: '/transactions', name: 'transactions', component: Transaction, meta: { requireAuth: true } },
    { path: '/transactions/:id', name: 'transaction-edit', component: TransactionEdit, meta: { requireAuth: true } },
    { path: '/job-logs', name: 'job-logs', component: JobLogs, meta: { requireAuth: true } },
    { path: '/job-logs-team', name: 'job-logs-team', component: JobLogsTeam, meta: { requireAuth: true } },
    { path: '/job-log-blacklist', name: 'job-log-blacklist', component: JobLogBlacklist, meta: { requireAuth: true } },
    { path: '/jobs', name: 'jobs', component: Job, meta: { requireAuth: true } },
    { path: '/jobs/:id', name: 'jobs-from-company', component: JobFilter, meta: { requireAuth: true } },
    { path: '/jobs-team/:id', name: 'jobs-from-company-team', component: JobTeamFilter, meta: { requireAuth: true } },
    { path: '/jobs-team', name: 'jobs-team', component: JobTeam, meta: { requireAuth: true } },
    { path: '/benefits', name: 'benefits', component: Benefits, meta: { requireAuth: true } },
    { path: '/benefits/new', name: 'benefits-add', component: BenefitsAdd, meta: { requireAuth: true } },
    { path: '/benefits/:id', name: 'benefits-edit', component: BenefitsEdit, meta: { requireAuth: true } },
    { path: '/addons', name: 'addons', component: Addons, meta: { requireAuth: true } },
    { path: '/addons/:id', name: 'addons-edit', component: AddonsEdit, meta: { requireAuth: true } },
    { path: '/addons/new', name: 'addons-add', component: AddonsAdd, meta: { requireAuth: true } },
    { path: '/settings', name: 'settings', component: Settings, meta: { requireAuth: true } },
    { path: '/share-images', name: 'share-images', component: ShareImages, meta: { requireAuth: true } },
    { path: '/job-languages', name: 'job-language', component: JobLanguages, meta: { requireAuth: true } },
    { path: '/job-language/new', name: 'job-language-add', component: JobLanguagesAdd, meta: { requireAuth: true } },
    { path: '/job-language/:id', name: 'job-language-edit', component: JobLanguagesEdit, meta: { requireAuth: true } },
    { path: '/app-logs', name: 'app-logs', component: AppLogs, meta: { requireAuth: true } },
    { path: '/app-logs-team', name: 'app-logs-team', component: AppLogsTeam, meta: { requireAuth: true } },

    { path: '/admin-user', name: 'admin-user', component: AdminUser, meta: { requireAuth: true } },
    { path: '/admin-user/:id', name: 'admin-user-edit', component: AdminUserEdit, meta: { requireAuth: true } },
    { path: '/admin-user/new', name: 'admin-user-add', component: AdminUserAdd, meta: { requireAuth: true } },
  ]
})

export default router