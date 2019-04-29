<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "title">
    <#elseif section = "header">
    <#elseif section = "form">
        <h1>Register</h1>
        <p class="text-muted">Create your account</p>
        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">


            <div class="input-group mb-3 ${messagesPerField.printIfExists('firstName',properties.kcFormGroupErrorClass!)}">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-user"></i> </span>
                </div>
                <input type="text" id="firstName" class="${properties.kcInputClass!}" name="firstName" value="${(register.formData.firstName!'')}" placeholder="${msg("firstName")}" title="${msg("firstName")}"/>
            </div>



            <div class="input-group mb-3 ${messagesPerField.printIfExists('lastName',properties.kcFormGroupErrorClass!)}">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-people"></i> </span>
                </div>
                <input type="text" id="lastName" class="${properties.kcInputClass!}" name="lastName" value="${(register.formData.lastName!'')}" placeholder="${msg("lastName")}" title="${msg("lastName")}" />
            </div>

            <div class="input-group mb-3 ${messagesPerField.printIfExists('email',properties.kcFormGroupErrorClass!)}">
                <div class="input-group-prepend">
                    <span class="input-group-text"> @ </span>
                </div>
                <input type="text" id="email" class="${properties.kcInputClass!}" name="email" value="${(register.formData.email!'')}" autocomplete="email" placeholder="${msg("email")}" title="${msg("email")}" />
            </div>

            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-phone"></i> </span>
                </div>
                <input type="text" id="user.attributes.phoneNumber" class="${properties.kcInputClass!}" name="user.attributes.phoneNumber" placeholder="Phone Number" title="Phone Number" />
            </div>

            <!-- <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-hourglass"></i> </span>
                </div>
                <input type="number" id="user.attributes.boatCapacity" class="${properties.kcInputClass!}" name="user.attributes.boatCapacity" placeholder="Boat Capacity" title="Boat Capacity" />
            </div> -->

            <!-- <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-plus"></i> </span>
                </div>
                <select class="${properties.kcInputClass!}" name="user.attributes.medical" id="user.attributes.medical" title="Provide Medical?">
                    <option>true</option>
                    <option>false</option>
                </select>
            </div> -->

          <#if !realm.registrationEmailAsUsername>
            <div class="input-group mb-3 ${messagesPerField.printIfExists('username',properties.kcFormGroupErrorClass!)}">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-user"></i> </span>
                </div>
                <input type="text" id="username" class="${properties.kcInputClass!}" name="username" value="${(register.formData.username!'')}" autocomplete="username" placeholder="${msg("username")}" title="${msg("username")}" />
            </div>
          </#if>

            <#if passwordRequired>
            <div class="input-group mb-3 ${messagesPerField.printIfExists('password',properties.kcFormGroupErrorClass!)}">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-lock"></i> </span>
                </div>
                <input type="password" id="password" class="${properties.kcInputClass!}" name="password" autocomplete="new-password" placeholder="${msg("password")}"  title="${msg("password")}"/>
            </div>

            <div class="input-group mb-3 ${messagesPerField.printIfExists('password-confirm',properties.kcFormGroupErrorClass!)}">
                <div class="input-group-prepend">
                    <span class="input-group-text"> <i class="icon-lock"></i> </span>
                </div>
                <input type="password" id="password-confirm" class="${properties.kcInputClass!}" name="password-confirm" placeholder="${msg("passwordConfirm")}" title="${msg("passwordConfirm")}" />
            </div>
            </#if>

            <#if recaptchaRequired??>
            <div class="form-group">
                <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
            </div>
            </#if>

            <div class="row">
                <div class="col-6">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonSuccessClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doRegister")}"/>
                </div>
                <div class="col-6 text-right">
                    <span class="align-middle"><a href="${url.loginUrl}">Back to Login</a></span>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>