<template lang="pug">
  .root-fill-out-person
    .wp-card
      el-card.card-person
        span(slot="header") 个人信息

        el-form(ref="personForm" :model="model" label-suffix=":" size="small" :show-message="false" hide-required-asterisk)
          el-form-item(required prop="name" label="姓名" label-width="60px")
            el-input(v-if="editable" v-model="model.name")
            span(v-else) {{model.name}}

          el-form-item(required prop="sex" label="性别" label-width="60px")
            el-radio(v-if="editable" v-model="model.sex" label="男")
            el-radio(v-if="editable" v-model="model.sex" label="女")
            span(v-else) {{model.sex}}

          el-form-item(required prop="birthday" label="出生日期" label-width="90px")
            el-date-picker(v-if="editable" v-model="model.birthday")
            span(v-else-if="model.birthday") {{model.birthday | date}}

          el-form-item(required prop="nation" label="民族" label-width="60px")
            el-select(v-if="editable" v-model="model.nation")
              el-option(v-for="item in nationList" :key="item.id" :value="item.name")
            span(v-else) {{model.nation}}

          el-form-item(required prop="politics" label="政治面貌" label-width="90px")
            el-select(v-if="editable" v-model="model.politics")
              el-option(v-for="item in politicsList" :key="item.id" :value="item.name")
            span(v-else) {{model.politics}}

          el-form-item(label="省联考号" label-width="90px")
            el-input(v-if="editable" v-model="model.provinceExamNo" placeholder="无省联考可不填")
            span(v-else) {{model.provinceExamNo}}

          el-form-item(required prop="hometown" label="生源地" label-width="60px")
            el-cascader(v-if="editable" v-model="model.hometown" :options="cityList" :props="{value: 'label'}")
            span(v-else-if="model.hometown[0]") {{model.hometown[0] + ' ' + model.hometown[1]}}

          el-form-item(required prop="school" label="毕业院校" label-width="90px")
            el-input(v-if="editable" v-model="model.school")
            span(v-else) {{model.school}}

          el-form-item(label="高考考号" label-width="90px")
            el-input(v-if="editable" v-model="model.collegeExamNo" placeholder="尚未报名可不填")
            span(v-else) {{model.collegeExamNo}}

      el-card.card-contact
        span(slot="header") 联系方式

        el-form(ref="contactForm" :model="model" label-suffix=":" size="small" :show-message="false" hide-required-asterisk)
          el-form-item(required prop="phoneNumber2" label="手机号" label-width="60px")
            el-input(v-if="editable" v-model="model.phoneNumber2")
            span(v-else) {{model.phoneNumber2}}

          el-form-item(required prop="postcode" label="邮政编码" label-width="90px")
            el-input(v-if="editable" v-model="model.postcode")
            span(v-else) {{model.postcode}}

          el-form-item(required prop="address" label="邮寄地址" label-width="75px" style="width: 100%")
            el-input(v-if="editable" v-model="model.address")
            span(v-else) {{model.address}}

          el-form-item(required prop="receiver" label="收件人" label-width="60px")
            el-input(v-if="editable" v-model="model.receiver")
            span(v-else) {{model.receiver}}

          el-form-item(required prop="receiverContact" label="联系电话" label-width="90px")
            el-input(v-if="editable" v-model="model.receiverContact")
            span(v-else) {{model.receiverContact}}

    el-card.card-family
      span(slot="header") 家庭信息

      el-table(:data="model.family")
        template(slot="empty")
          el-button(v-if="editable" size="small" @click="addFamily()" style="width: 150px") 添加
          span(v-else) 暂无数据

        el-table-column(label="姓名")
          template(slot-scope="scope")
            el-input(v-if="editable" v-model="scope.row.name" size="small")
            span(v-else) {{scope.row.name}}

        el-table-column(label="亲属关系")
          template(slot-scope="scope")
            el-input(v-if="editable" v-model="scope.row.relationship" size="small")
            span(v-else) {{scope.row.relationship}}

        el-table-column(label="政治面貌")
          template(slot-scope="scope")
            el-select(v-if="editable" v-model="scope.row.politics" size="small")
              el-option(v-for="item in politicsList" :key="item.id" :value="item.name")
            span(v-else) {{scope.row.politics}}

        el-table-column(label="工作单位")
          template(slot-scope="scope")
            el-input(v-if="editable" v-model="scope.row.company" size="small")
            span(v-else) {{scope.row.company}}

        el-table-column(label="手机号")
          template(slot-scope="scope")
            el-input(v-if="editable" v-model="scope.row.phoneNumber" size="small")
            span(v-else) {{scope.row.phoneNumber}}

        el-table-column
          template(slot-scope="scope")
            el-button(v-if="editable" size="small" type="danger" @click="removeFamily(scope.$index)") 删除
            el-button(v-if="editable && scope.$index === model.family.length - 1" size="small" type="success" @click="addFamily()") 添加
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import api from '@/api';

@Component({})
export default class FillOutPerson extends Vue {
  @Prop()
  private editable;
  @Prop()
  private model;

  private nationList: any[] = require('@/assets/nation.json');
  private politicsList: any[] = require('@/assets/politics.json');
  private cityList: any[] = require('@/assets/city.json');

  public addFamily() {
    this.model.family.push({});
  }

  public async removeFamily(index: number) {
    await this.$confirm('确定要删除家庭成员吗？', {
      title: '提示',
      type: 'warning',
    });

    this.model.family.splice(index, 1);
  }

  public async validate() {
    const personValid = await new Promise((resolve, reject) => {
      (this.$refs.personForm as Form).validate((valid: boolean) => {
        resolve(valid);
      });
    });

    const contactValid = await new Promise((resolve, reject) => {
      (this.$refs.contactForm as Form).validate((valid: boolean) => {
        resolve(valid);
      });
    });

    return (personValid && contactValid) as boolean;
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-fill-out-person {
  .wp-card {
    display: flex;

    .card-person {
      width: 60%;
      margin-right: 15px;

      .el-card__header {
        background-color: #9d4a9c;
      }

      .el-form-item {
        width: 33%;

        .el-date-editor {
          width: 100%;
        }
      }
    }

    .card-contact {
      width: 40%;
      margin-left: 15px;

      .el-card__header {
        background-color: $color-primary;
      }

      .el-form-item {
        width: 50%;
      }
    }
  }

  .card-family {
    margin-top: 20px;

    .el-card__header {
      background-color: $color-secondary;
    }
  }
}
</style>
