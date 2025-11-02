document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const inputs = form.querySelectorAll('input');
  const interests = document.getElementById('interests');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');

  
  inputs.forEach(input => {
    const saved = localStorage.getItem(input.name);
    if (saved) input.value = saved;
    input.addEventListener('input', () => {
      localStorage.setItem(input.name, input.value);
    });
  });

 
  interests.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const checked = interests.querySelectorAll('input:checked').length;
      document.getElementById('err-interests').textContent =
        checked === 0 ? '請至少選擇一項興趣' : '';
    }
  });

  
  form.addEventListener('blur', handleValidation, true);
  form.addEventListener('input', handleValidation, true);

  function handleValidation(e) {
    const el = e.target;
    if (!el.matches('input')) return;

    
    el.setCustomValidity('');
    const errMsg = document.getElementById(`err-${el.id}`);
    if (errMsg) errMsg.textContent = '';

    if (el.validity.valueMissing) {
      el.setCustomValidity('此欄位為必填');
    } else if (el.type === 'email' && el.validity.typeMismatch) {
      el.setCustomValidity('請輸入正確的 Email 格式');
    } else if (el.id === 'phone' && !/^\d{10}$/.test(el.value)) {
      el.setCustomValidity('手機號碼需為 10 碼數字');
    } else if (el.id === 'password') {
      updateStrength(el.value);
      if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(el.value)) {
        el.setCustomValidity('密碼需至少 8 碼，且包含英文與數字');
      }
    } else if (el.id === 'confirmPassword') {
      const pwd = document.getElementById('password').value;
      if (el.value !== pwd) el.setCustomValidity('密碼不一致');
    }

    
    if (!el.checkValidity()) {
      errMsg.textContent = el.validationMessage;
    }
  }

  
  const bar = document.querySelector('#strength-bar span');
  const msg = document.getElementById('strength-msg');

  function updateStrength(val) {
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
    if (/\d/.test(val)) strength++;
    const levels = ['弱', '中', '強'];
    bar.style.width = `${(strength / 3) * 100}%`;
    bar.className = strength === 1 ? 'weak' : strength === 2 ? 'medium' : 'strong';
    msg.textContent = val ? `密碼強度：${levels[strength - 1] || '弱'}` : '';
  }

  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let firstError = null;

    
    const checked = interests.querySelectorAll('input:checked').length;
    if (checked === 0) {
      document.getElementById('err-interests').textContent = '請至少選擇一項興趣';
      firstError = firstError || interests.querySelector('input');
    }

   
    inputs.forEach(input => {
      input.reportValidity();
      if (!input.checkValidity() && !firstError) firstError = input;
    });

    if (firstError) {
      firstError.focus();
      return;
    }

    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
    successMsg.textContent = '';

    setTimeout(() => {
      successMsg.textContent = '✅ 註冊成功！';
      submitBtn.disabled = false;
      submitBtn.textContent = '註冊';
      form.reset();
      bar.style.width = '0';
      msg.textContent = '';
      localStorage.clear();
    }, 1000);
  });

  
  document.getElementById('resetBtn').addEventListener('click', () => {
    form.querySelectorAll('.error').forEach(e => e.textContent = '');
    bar.style.width = '0';
    msg.textContent = '';
    localStorage.clear();
  });
});
