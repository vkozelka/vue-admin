<template>
  <admin-layout>
    <span slot="admin-page-title">{{t('Jobs (Team)')}}</span>
    <ui-grid v-if="$route.params && $route.params.id" ref="jobGrid" :component="this" :filter="true" :columns="columns" :pager="true" :limiter="true" :search="true" :resource_url="'backend/job/index/'+$route.params.id" :export="false" :limit_options="limitOpt" :defaultOrderDir="'desc'">
      <template slot="grid-items" slot-scope="props">

        <td>{{props.item.j.id_job}}</td>
        <td><a target="_blank" :href="'/cs/addetail/' + props.item.jc.slug + '?adminPreview=1'">{{ props.item.jc.title}}</a></td>
        <td class="break"><a target="_blank" :href="'/cs/company/' + (parseInt(props.item.u.id_user) + 100)">{{ props.item.ud.company_name }}</a></td>
        <td>{{getCC(props.item.CC)}}</td>
        <td><a @click="editAC(props.item.j,props.item.jc.title)">{{ props.item.j.AC ? props.item.j.AC : 0 }}</a></td>
        <td>{{props.item.us.id_job_sector? addHundred(props.item.us.id_job_sector):'' }}</td>
        <td>{{getAD(props.item.jhc.id_job_contract) }}</td>
        <td>{{addHundred(props.item.jhs.id_job_sector) }}</td>
        <td>{{t('ryb')}}</td>
        <td class="text-xs-center">{{props.item.j.views}}</td>
        <td class="text-xs-center">{{props.item.click_applications}}</td>
        <td class="text-xs-center">{{props.item.applications}}</td>
        <td class="text-xs-center">
          <span v-if="props.item.j.deleted_at">DEL</span>
          <span v-else-if="props.item.j.is_active == 1">ON</span>
          <span v-else>OFF</span>
        </td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.j.sort_time, "DD.MM.YYYY")}}</td>
        <td class="text-xs-center">{{datetimeFormatCustom(props.item.j.created_at, "DD.MM.YYYY")}}</td>
        <td class="text-xs-center"><span :class="{'red--text':checkExpire(props.item.j.active_to)}">{{datetimeFormatCustom(props.item.j.active_to, "DD.MM.YYYY")}}</span></td>
        <td>{{getPackage(props.item.package_name)}}</td>
      </template>
    </ui-grid>


    <v-dialog v-if="acEdit" v-model="acEdit" max-width="500px">
      <v-card>
        <v-card-title>
          <span>{{ t('Edit AC') }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field type="number" v-model="acValue.value" :label="'AC for: ' + acValue.title "></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="cancelAC()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green" flat @click.stop="saveAC()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </admin-layout>
</template>

<script>
  import JobTeam from "./JobTeam"
  export default {
    extends: JobTeam,
  }
</script>

<style scoped>
  .break {
    max-width: 160px;
  }
</style>
