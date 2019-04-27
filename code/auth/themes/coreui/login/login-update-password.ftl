<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "title">
        ${msg("updatePasswordTitle")}
    <#elseif section = "header">
    <#elseif section = "form">
        <h1>${msg("loginTitleHtml",(realm.displayNameHtml!''))?no_esc}</h1>
        <p class="text-muted">Please update your password</p>
        <form id="kc-passwd-update-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <input type="text" id="username" name="username" value="${username}" autocomplete="username" readonly="readonly" style="display:none;"/>
            <input type="password" id="password" name="password" autocomplete="current-password" style="display:none;"/>

            <div class="input-group mb-4">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-lock"></i> </span>
                </div>
                <input id="password-new" class="${properties.kcInputClass!}" name="password-new" type="password" autocomplete="password-new" autofocus placeholder="New Password"/>
            </div>
            <div class="input-group mb-4">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-lock"></i> </span>
                </div>
                <input type="password" id="password-confirm" name="password-confirm" class="${properties.kcInputClass!}" autocomplete="new-password" placeholder="Confirm Password"/>
            </div>

            <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}"/>
        </form>
    </#if>
</@layout.registrationLayout>
